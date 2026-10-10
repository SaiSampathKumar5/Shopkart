from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r"products", views.ProductViewSet, basename="product")

urlpatterns = [
    path("", include(router.urls)),
    path("orders/", views.create_order, name="create-order"),
    path("orders/<str:order_id>/", views.get_order, name="get-order"),
]
