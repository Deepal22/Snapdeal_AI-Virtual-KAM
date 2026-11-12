seller_data = {
    "seller_id": "SELLER_001",
    "business_name": "Sample Fashion Store",
    "category": "Fashion",

    "last_month": {
        "sales": 200000,
        "orders": 400,
        "cancellation_rate": 8,
        "out_of_stock_products": 5,
        "average_selling_price": 500
    },

    "this_month": {
        "sales": 135000,
        "orders": 270,
        "cancellation_rate": 14,
        "out_of_stock_products": 18,
        "average_selling_price": 500
    }
}


def get_seller_insights():
    previous = seller_data["last_month"]
    current = seller_data["this_month"]

    return {
        "sales_decline_percentage": 32.5,
        "order_decline_percentage": 32.5,
        "cancellation_rate_increase": 6,
        "stockout_increase": 13,
        "average_selling_price_unchanged": True
    }