"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

// Mock order data - In a real app, this would come from an API
const mockOrders = [
  {
    id: "ORD-2024-001",
    orderDate: "2024-01-15",
    status: "Delivered",
    total: 45.97,
    items: [
      { id: 1, title: "Spider-Man #1", author: "Stan Lee", price: 4.99, quantity: 2, image: "/comic-slider1.png" },
      { id: 2, title: "Batman Annual", author: "Bob Kane", price: 6.99, quantity: 1, image: "/comic-slider5.png" },
      { id: 3, title: "X-Men #1", author: "Stan Lee", price: 5.99, quantity: 3, image: "/comic-slider3.png" },
    ],
    shippingAddress: "123 Main St, New York, NY 10001",
    estimatedDelivery: "2024-01-20",
    deliveredDate: "2024-01-19",
    trackingNumber: "TRK123456789",
  },
  {
    id: "ORD-2024-002",
    orderDate: "2024-01-10",
    status: "Shipped",
    total: 28.97,
    items: [
      { id: 4, title: "One Piece Vol.1", author: "Eiichiro Oda", price: 7.99, quantity: 1, image: "/comic-slide4.png" },
      { id: 5, title: "Attack on Titan", author: "Hajime Isayama", price: 8.99, quantity: 1, image: "/comic-slider3.png" },
      { id: 6, title: "Deadpool #1", author: "Fabian Nicieza", price: 5.99, quantity: 1, image: "/comic-slider1.png" },
    ],
    shippingAddress: "123 Main St, New York, NY 10001",
    estimatedDelivery: "2024-01-25",
    trackingNumber: "TRK987654321",
  },
  {
    id: "ORD-2024-003",
    orderDate: "2024-01-08",
    status: "On the way",
    total: 19.98,
    items: [
      { id: 7, title: "The Avengers", author: "Stan Lee", price: 6.99, quantity: 2, image: "/comic-slider3.png" },
      { id: 8, title: "Wonder Woman", author: "William Moulton Marston", price: 6.49, quantity: 1, image: "/comic-slider5.png" },
    ],
    shippingAddress: "123 Main St, New York, NY 10001",
    estimatedDelivery: "2024-01-22",
    trackingNumber: "TRK456789123",
  },
  {
    id: "ORD-2024-004",
    orderDate: "2024-01-05",
    status: "Delivered",
    total: 34.97,
    items: [
      { id: 9, title: "Naruto Vol.1", author: "Masashi Kishimoto", price: 9.99, quantity: 1, image: "/comic-slider1.png" },
      { id: 10, title: "Dragon Ball Z", author: "Akira Toriyama", price: 8.99, quantity: 1, image: "/comic-slider5.png" },
      { id: 11, title: "Superman Returns", author: "Jerry Siegel", price: 7.49, quantity: 1, image: "/comic-slide4.png" },
      { id: 12, title: "Iron Man #1", author: "Stan Lee", price: 5.49, quantity: 1, image: "/comic-slide4.png" },
    ],
    shippingAddress: "123 Main St, New York, NY 10001",
    estimatedDelivery: "2024-01-12",
    deliveredDate: "2024-01-11",
    trackingNumber: "TRK789123456",
  },
  {
    id: "ORD-2024-005",
    orderDate: "2024-01-03",
    status: "Delivered",
    total: 12.99,
    items: [
      { id: 13, title: "The Walking Dead Vol.1", author: "Robert Kirkman", price: 12.99, quantity: 1, image: "/comic-slider3.png" },
    ],
    shippingAddress: "123 Main St, New York, NY 10001",
    estimatedDelivery: "2024-01-08",
    deliveredDate: "2024-01-07",
    trackingNumber: "TRK321654987",
  },
];

const ITEMS_PER_PAGE = 5;

export default function OrdersPage() {
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [displayCount, setDisplayCount] = useState(ITEMS_PER_PAGE);

  // Filter orders by status
  const filteredOrders = mockOrders.filter(
    (order) => selectedStatus === "All" || order.status.toLowerCase() === selectedStatus.toLowerCase()
  );

  // Get displayed orders
  const displayedOrders = filteredOrders.slice(0, displayCount);
  const hasMore = displayCount < filteredOrders.length;

  const handleLoadMore = () => {
    setDisplayCount((prev) => Math.min(prev + ITEMS_PER_PAGE, filteredOrders.length));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "text-green-400 bg-green-400/20 border-green-400/30";
      case "shipped":
        return "text-blue-400 bg-blue-400/20 border-blue-400/30";
      case "on the way":
        return "text-yellow-400 bg-yellow-400/20 border-yellow-400/30";
      case "pending":
        return "text-gray-400 bg-gray-400/20 border-gray-400/30";
      case "cancelled":
        return "text-red-400 bg-red-400/20 border-red-400/30";
      default:
        return "text-gray-400 bg-gray-400/20 border-gray-400/30";
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-white mb-2">Your Orders</h1>
          <p className="text-gray-400 text-sm">
            {filteredOrders.length} {filteredOrders.length === 1 ? "order" : "orders"} placed
            {selectedStatus !== "All" && ` in ${selectedStatus}`}
          </p>
        </div>

        {/* Filter */}
        <div className="mb-6 flex items-center gap-4">
          <label className="text-gray-400 text-sm font-medium">Filter by Status:</label>
          <select
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
              setDisplayCount(ITEMS_PER_PAGE);
            }}
            className="bg-gray-900 border border-gray-700 text-white px-4 py-2 rounded-lg text-sm focus:outline-none focus:border-yellow-400 min-w-[150px] cursor-pointer"
          >
            <option value="All">All Orders</option>
            <option value="Delivered">Delivered</option>
            <option value="Shipped">Shipped</option>
            <option value="On the way">On the way</option>
            <option value="Pending">Pending</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        {/* Orders List */}
        {displayedOrders.length === 0 ? (
          <div className="text-center py-16">
            <div className="mb-6">
              <svg className="w-24 h-24 mx-auto text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-black text-white mb-4">No orders found</h2>
            <p className="text-gray-400 mb-8">You haven't placed any orders yet.</p>
            <Link
              href="/"
              className="inline-block bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-bold py-3 px-8 rounded-lg transition-all cursor-pointer"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {displayedOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-gray-800 overflow-hidden hover:border-gray-700 transition-all"
                >
                  {/* Order Header */}
                  <div className="p-4 sm:p-6 border-b border-gray-800">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-4 mb-2">
                          <div>
                            <p className="text-xs text-gray-400 mb-1">Order Placed</p>
                            <p className="text-sm font-semibold text-white">{formatDate(order.orderDate)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-400 mb-1">Total</p>
                            <p className="text-sm font-semibold text-white">${order.total.toFixed(2)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-400 mb-1">Ship to</p>
                            <p className="text-sm font-semibold text-white line-clamp-1">{order.shippingAddress.split(",")[0]}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-400 mb-1">Order #{order.id}</p>
                            <button
                              onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                              className="text-yellow-400 hover:text-yellow-300 text-sm font-bold cursor-pointer"
                            >
                              {expandedOrder === order.id ? "Hide Order Details" : "View Order Details"}
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(order.status)}`}
                        >
                          {order.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-4 sm:p-6">
                    <div className="space-y-4">
                      {order.items.map((item, index) => (
                        <div
                          key={item.id}
                          className={`flex flex-col sm:flex-row gap-4 ${
                            index !== order.items.length - 1 ? "pb-4 border-b border-gray-800" : ""
                          }`}
                        >
                          <Link
                            href={`/comic/${item.id}`}
                            className="relative w-full sm:w-24 h-32 sm:h-32 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg overflow-hidden border border-gray-700 shrink-0"
                          >
                            <Image
                              src={item.image}
                              alt={item.title}
                              fill
                              className="object-cover"
                              sizes="(max-width: 640px) 100vw, 96px"
                            />
                          </Link>
                          <div className="flex-1">
                            <Link href={`/comic/${item.id}`}>
                              <h3 className="text-white font-bold text-base mb-1 hover:text-yellow-400 transition-colors">
                                {item.title}
                              </h3>
                            </Link>
                            <p className="text-gray-400 text-sm mb-2">{item.author}</p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <span className="text-yellow-400 font-bold">${item.price}</span>
                                <span className="text-gray-500 text-sm">Qty: {item.quantity}</span>
                              </div>
                              <div className="flex gap-2">
                                <button className="text-yellow-400 hover:text-yellow-300 text-sm font-bold cursor-pointer">
                                  Buy again
                                </button>
                                {order.status === "Delivered" && (
                                  <>
                                    <span className="text-gray-600">|</span>
                                    <button className="text-yellow-400 hover:text-yellow-300 text-sm font-bold cursor-pointer">
                                      Write a review
                                    </button>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Expanded Order Details */}
                    {expandedOrder === order.id && (
                      <div className="mt-6 pt-6 border-t border-gray-800 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-white font-bold mb-2">Shipping Address</h4>
                            <p className="text-gray-400 text-sm">{order.shippingAddress}</p>
                          </div>
                          <div>
                            <h4 className="text-white font-bold mb-2">Order Summary</h4>
                            <div className="space-y-1 text-sm">
                              <div className="flex justify-between text-gray-400">
                                <span>Items ({order.items.reduce((sum, item) => sum + item.quantity, 0)}):</span>
                                <span className="text-white">${(order.total - 9.99).toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between text-gray-400">
                                <span>Shipping:</span>
                                <span className="text-white">$9.99</span>
                              </div>
                              <div className="flex justify-between text-gray-400">
                                <span>Tax:</span>
                                <span className="text-white">${((order.total - 9.99) * 0.08).toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between text-white font-bold pt-2 border-t border-gray-800">
                                <span>Order Total:</span>
                                <span className="text-yellow-400">${order.total.toFixed(2)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        {order.trackingNumber && (
                          <div>
                            <h4 className="text-white font-bold mb-2">Tracking Information</h4>
                            <div className="flex items-center gap-4">
                              <p className="text-gray-400 text-sm">
                                Tracking Number: <span className="text-white font-semibold">{order.trackingNumber}</span>
                              </p>
                              <button className="text-yellow-400 hover:text-yellow-300 text-sm font-bold cursor-pointer">
                                Track Package
                              </button>
                            </div>
                            {order.estimatedDelivery && (
                              <p className="text-gray-400 text-sm mt-2">
                                Estimated Delivery: <span className="text-white">{formatDate(order.estimatedDelivery)}</span>
                              </p>
                            )}
                            {order.deliveredDate && (
                              <p className="text-green-400 text-sm mt-2">
                                Delivered on: <span className="text-white">{formatDate(order.deliveredDate)}</span>
                              </p>
                            )}
                          </div>
                        )}
                        <div className="flex gap-3 pt-4">
                          <button className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded-lg border border-gray-700 transition-all cursor-pointer">
                            Invoice
                          </button>
                          {order.status === "Delivered" && (
                            <button className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded-lg border border-gray-700 transition-all cursor-pointer">
                              Return or Replace Items
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Load More Button */}
            {hasMore && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={handleLoadMore}
                  className="border-2 border-yellow-400 hover:bg-yellow-400 text-yellow-400 hover:text-black font-bold px-6 py-2.5 rounded-lg transition-all cursor-pointer"
                >
                  Load More Orders
                </button>
              </div>
            )}

            {/* Show all loaded message */}
            {!hasMore && displayedOrders.length > 0 && (
              <div className="text-center py-8">
                <p className="text-gray-400 text-sm">
                  You&apos;ve viewed all {filteredOrders.length} {filteredOrders.length === 1 ? "order" : "orders"}
                  {selectedStatus !== "All" && ` in ${selectedStatus}`}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

