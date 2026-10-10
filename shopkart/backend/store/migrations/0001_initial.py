from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True
    dependencies = []

    operations = [
        migrations.CreateModel(
            name="Product",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False)),
                ("name", models.CharField(max_length=200)),
                ("category", models.CharField(choices=[("Electronics", "Electronics"), ("Fashion", "Fashion"), ("Home", "Home"), ("Books", "Books")], max_length=50)),
                ("price", models.DecimalField(decimal_places=2, max_digits=10)),
                ("mrp", models.DecimalField(decimal_places=2, max_digits=10)),
                ("rating", models.DecimalField(decimal_places=1, default=4.0, max_digits=2)),
                ("emoji", models.CharField(default="📦", max_length=10)),
                ("color", models.CharField(default="#f0e6d2", max_length=10)),
                ("stock", models.PositiveIntegerField(default=100)),
            ],
        ),
        migrations.CreateModel(
            name="Order",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False)),
                ("order_id", models.CharField(max_length=20, unique=True)),
                ("customer_name", models.CharField(max_length=200)),
                ("address", models.TextField()),
                ("city", models.CharField(blank=True, max_length=100)),
                ("pincode", models.CharField(blank=True, max_length=10)),
                ("status", models.CharField(choices=[("placed", "Placed"), ("shipped", "Shipped"), ("delivered", "Delivered")], default="placed", max_length=20)),
                ("total", models.DecimalField(decimal_places=2, max_digits=10)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.CreateModel(
            name="OrderItem",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False)),
                ("quantity", models.PositiveIntegerField(default=1)),
                ("price_at_purchase", models.DecimalField(decimal_places=2, max_digits=10)),
                ("order", models.ForeignKey(on_delete=models.CASCADE, related_name="items", to="store.order")),
                ("product", models.ForeignKey(on_delete=models.PROTECT, to="store.product")),
            ],
        ),
    ]
