type OrderItem = {
  id: string;
  quantity: number;
  product: {
    name: string;
  };
};

type Order = {
  id: string;
  status: string;
  paymentStatus: string;
  totalAmount: number;
  items: OrderItem[];
};

export default function OrderCard({ order }: { order: Order }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-500">
          Order ID
        </h2>
        <span className="text-xs text-slate-400">{order.id}</span>
      </div>

      <div className="mt-4 flex flex-wrap gap-4 text-sm">
        <span className="rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-700">
          Status: {order.status}
        </span>

        <span className="rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-700">
          Payment: {order.paymentStatus}
        </span>
      </div>

      <div className="mt-6 space-y-2">
        {order.items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between text-sm text-slate-600"
          >
            <span>{item.product.name}</span>
            <span>x {item.quantity}</span>
          </div>
        ))}
      </div>

      <div className="mt-6 border-t border-slate-200 pt-4 flex justify-between">
        <span className="text-sm text-slate-500">Total</span>
        <span className="text-lg font-bold text-slate-900">
          {new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(order.totalAmount)}
        </span>
      </div>
    </div>
  );
}