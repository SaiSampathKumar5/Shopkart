from django.db import migrations

PRODUCTS = [
    ("Wireless Bluetooth Earbuds", "Electronics", 1499, 2999, 4.2, "🎧", "#f0e6d2"),
    ("Smart Fitness Band", "Electronics", 1899, 3499, 4.0, "⌚", "#e2ecf0"),
    ("27-inch 4K Monitor", "Electronics", 18999, 24999, 4.5, "🖥️", "#e8e4f0"),
    ("Portable Power Bank 20000mAh", "Electronics", 1299, 1999, 4.3, "🔋", "#f0e6d2"),
    ("Men's Cotton Casual Shirt", "Fashion", 699, 1499, 4.1, "👔", "#f4e8e2"),
    ("Women's Ethnic Kurta Set", "Fashion", 1199, 2499, 4.4, "👗", "#f0dce6"),
    ("Running Sneakers", "Fashion", 2199, 3999, 4.3, "👟", "#e2f0e6"),
    ("Leather Wallet", "Fashion", 499, 999, 4.0, "👛", "#f4e8e2"),
    ("Non-stick Cookware Set", "Home", 2499, 4499, 4.2, "🍳", "#eaf0e2"),
    ("Memory Foam Pillow (Pack of 2)", "Home", 899, 1599, 4.1, "🛏️", "#e2e8f0"),
    ("LED Table Lamp", "Home", 649, 1199, 4.3, "💡", "#f0ecda"),
    ("6-Seater Dining Table", "Home", 15999, 22999, 4.4, "🪑", "#ede2d0"),
    ("Bestselling Fiction Novel", "Books", 299, 499, 4.6, "📖", "#e2ecec"),
    ("Self-Help & Productivity Book", "Books", 349, 599, 4.3, "📘", "#e2e6ec"),
    ("Kids' Picture Book Set", "Books", 449, 799, 4.5, "📚", "#f0e2e6"),
    ("Stainless Steel Water Bottle", "Home", 399, 699, 4.2, "🍶", "#e2f0ec"),
]


def seed(apps, schema_editor):
    Product = apps.get_model("store", "Product")
    for name, category, price, mrp, rating, emoji, color in PRODUCTS:
        Product.objects.create(
            name=name, category=category, price=price, mrp=mrp,
            rating=rating, emoji=emoji, color=color, stock=100,
        )


def unseed(apps, schema_editor):
    apps.get_model("store", "Product").objects.all().delete()


class Migration(migrations.Migration):
    dependencies = [("store", "0001_initial")]
    operations = [migrations.RunPython(seed, unseed)]
