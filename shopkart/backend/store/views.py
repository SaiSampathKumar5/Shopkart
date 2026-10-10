import random
from decimal import Decimal

from django.db import transaction
from rest_framework import viewsets, filters, status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import Product, Order, OrderItem
from .serializers import ProductSerializer, OrderCreateSerializer, OrderSerializer


class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    """
    GET /api/products/            -> list all products
    GET /api/products/?category=Fashion
    GET /api/products/?search=shirt
    GET /api/products/<id>/       -> single product
    """
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ["name"]

    def get_queryset(self):
        qs = super().get_queryset()
        category = self.request.query_params.get("category")
        if category and category.lower() != "all":
            qs = qs.filter(category=category)
        return qs


@api_view(["POST"])
def create_order(request):
    """
    POST /api/orders/
    body: {
      "customer_name": "...", "address": "...", "city": "...", "pincode": "...",
      "items": [{"product_id": 1, "quantity": 2}, ...]
    }
    Validates stock, computes the total server-side (never trusts client
    prices), creates the Order + OrderItems, and decrements stock.
    """
    serializer = OrderCreateSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    data = serializer.validated_data

    product_ids = [i["product_id"] for i in data["items"]]
    products = {p.id: p for p in Product.objects.filter(id__in=product_ids)}

    missing = [pid for pid in product_ids if pid not in products]
    if missing:
        return Response({"detail": f"Unknown product id(s): {missing}"}, status=400)

    for item in data["items"]:
        product = products[item["product_id"]]
        if product.stock < item["quantity"]:
            return Response(
                {"detail": f"Not enough stock for '{product.name}'."}, status=400
            )

    total = sum(
        products[item["product_id"]].price * item["quantity"] for item in data["items"]
    )

    with transaction.atomic():
        order = Order.objects.create(
            order_id="SK" + str(random.randint(100000, 999999)),
            customer_name=data["customer_name"],
            address=data["address"],
            city=data.get("city", ""),
            pincode=data.get("pincode", ""),
            total=total,
        )
        for item in data["items"]:
            product = products[item["product_id"]]
            OrderItem.objects.create(
                order=order,
                product=product,
                quantity=item["quantity"],
                price_at_purchase=product.price,
            )
            product.stock -= item["quantity"]
            product.save(update_fields=["stock"])

    return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)


@api_view(["GET"])
def get_order(request, order_id):
    """GET /api/orders/<order_id>/ -> look up an order by its order_id string."""
    try:
        order = Order.objects.get(order_id=order_id)
    except Order.DoesNotExist:
        return Response({"detail": "Order not found."}, status=404)
    return Response(OrderSerializer(order).data)
