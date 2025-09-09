import { getOrderDetails } from "@/api/get-order-details";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/dialog";
import { OrderStatus } from "@/components/order-status";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { OrderDetailsSkeleton } from "./order-details-skeleton";

export interface OrderDetailsProps {
  orderId: string;
  open: boolean;
}

interface OrderItem {
  id: string;
  product?: { name: string };
  priceInCents?: unknown; // pode vir string/Decimal/number
  unitPriceInCents?: unknown; // fallback
  price?: unknown; // fallback
  quantity: number;
}

// helper para converter QUALQUER forma para centavos (number)
function toCents(raw: unknown): number {
  if (raw == null) return 0;
  if (typeof raw === "number" && Number.isFinite(raw)) return Math.round(raw);

  if (typeof raw === "string") {
    const s = raw.trim();
    if (!s) return 0;
    // "4500" (centavos) → 4500 | "45,00"/"45.00" (reais) → 4500
    if (/[.,]/.test(s)) {
      const reais = parseFloat(s.replace(/\./g, "").replace(",", "."));
      return Number.isFinite(reais) ? Math.round(reais * 100) : 0;
    }
    const n = Number(s);
    return Number.isFinite(n) ? Math.round(n) : 0;
  }

  if (typeof raw === "object") {
    // Prisma Decimal, Big.js, etc.
    const maybe = (raw as any).toNumber?.() ?? (raw as any).valueOf?.();
    if (typeof maybe === "number" && Number.isFinite(maybe))
      return Math.round(maybe);
    if (typeof maybe === "string") {
      const n = Number(maybe);
      return Number.isFinite(n) ? Math.round(n) : 0;
    }
  }
  return 0;
}

export function OrderDetails({ orderId, open }: OrderDetailsProps) {
  const { data: order } = useQuery({
    queryKey: ["order", orderId],
    queryFn: () => getOrderDetails({ orderId }),
    enabled: open,
  });

  return (
    <DialogContent className="max-w-4xl">
      <DialogHeader>
        <DialogTitle>Nº Pedido: {orderId}</DialogTitle>
        <DialogDescription>Detalhes do pedido</DialogDescription>
      </DialogHeader>

      {order ? (
        <div className="space-y-6">
          <div className="overflow-x-auto">
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="text-muted-foreground">
                    Status
                  </TableCell>
                  <TableCell className="flex justify-end">
                    <OrderStatus status={order.status} />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-muted-foreground">
                    Cliente
                  </TableCell>
                  <TableCell className="flex justify-end">
                    {order.customer.name}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-muted-foreground">
                    Telefone
                  </TableCell>
                  <TableCell className="flex justify-end">
                    {order.customer.phone ?? "Não informado"}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-muted-foreground">
                    E-mail
                  </TableCell>
                  <TableCell className="flex justify-end">
                    {order.customer.email}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-muted-foreground">
                    Realizado há
                  </TableCell>
                  <TableCell className="flex justify-end">
                    {formatDistanceToNow(new Date(order.createdAt), {
                      locale: ptBR,
                      addSuffix: true,
                    })}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produto</TableHead>
                  <TableHead className="text-right">Qtd.</TableHead>
                  <TableHead className="text-right">Preço</TableHead>
                  <TableHead className="text-right">Subtotal</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {order.orderItems.map((item: OrderItem) => {
                  const unit = toCents(
                    item.priceInCents ?? item.unitPriceInCents ?? item.price,
                  );
                  const qty = Number(item.quantity ?? 0);
                  const subtotal = unit * qty;

                  return (
                    <TableRow key={item.id}>
                      <TableCell>{item.product?.name ?? "—"}</TableCell>
                      <TableCell className="text-right">{qty}</TableCell>
                      <TableCell className="text-right">
                        {(unit / 100).toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </TableCell>
                      <TableCell className="text-right">
                        {(subtotal / 100).toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>

              <TableFooter>
                <TableRow>
                  <TableCell colSpan={3}>Total do pedido</TableCell>
                  <TableCell className="text-right font-medium">
                    {(toCents(order.totalInCents) / 100).toLocaleString(
                      "pt-BR",
                      {
                        style: "currency",
                        currency: "BRL",
                      },
                    )}
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>
        </div>
      ) : (
        <OrderDetailsSkeleton />
      )}
    </DialogContent>
  );
}
