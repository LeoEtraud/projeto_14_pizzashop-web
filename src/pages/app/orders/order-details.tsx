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

// helper: converte qualquer forma comum de “preço” para centavos
function toCents(raw: unknown): number {
  if (raw == null) return 0;
  // já é número?
  if (typeof raw === "number" && Number.isFinite(raw)) return Math.round(raw);
  // string tipo "5000" (centavos) ou "50.00"/"50,00" (reais)
  const s = String(raw).trim();
  if (!s) return 0;
  // se tiver vírgula/ponto, tratamos como valor em reais
  if (/[.,]/.test(s)) {
    const reais = parseFloat(s.replace(/\./g, "").replace(",", "."));
    if (!Number.isFinite(reais)) return 0;
    return Math.round(reais * 100);
  }
  // caso contrário é inteiro em centavos
  const n = Number(s);
  return Number.isFinite(n) ? Math.round(n) : 0;
}

export function OrderDetails({ orderId, open }: OrderDetailsProps) {
  const { data: order } = useQuery({
    queryKey: ["order", orderId],
    queryFn: () => getOrderDetails({ orderId }),
    enabled: open,
    // Normaliza para a UI
    select: (o: any) => {
      const items = (o?.orderItems ?? []).map((it: any) => {
        const unitPriceInCents = toCents(
          it.priceInCents ?? it.unitPriceInCents ?? it.price,
        );
        const quantity = Number(it.quantity ?? 0);
        return {
          id: String(it.id),
          name: it.product?.name ?? it.name ?? "—",
          quantity,
          unitPriceInCents,
          subtotalInCents: unitPriceInCents * quantity,
        };
      });

      return {
        ...o,
        totalInCents: toCents(o?.totalInCents ?? o?.total ?? 0),
        orderItems: items,
      };
    },
  });

  return (
    <DialogContent className="max-w-4xl p-4">
      <DialogHeader className="pb-3">
        <DialogTitle>Nº Pedido: {orderId}</DialogTitle>
        <DialogDescription>Detalhes do pedido</DialogDescription>
      </DialogHeader>

      {order ? (
        <div className="space-y-4">
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
                {order.orderItems.map(
                  (item: {
                    id: string;
                    name: string;
                    quantity: number;
                    unitPriceInCents: number;
                    subtotalInCents: number;
                  }) => (
                    <TableRow key={item.id}>
                      {/* Produto */}
                      <TableCell>{item.name}</TableCell>

                      {/* Qtd. */}
                      <TableCell className="text-right">
                        {item.quantity}
                      </TableCell>

                      {/* Preço unitário */}
                      <TableCell className="text-right">
                        {(item.unitPriceInCents / 100).toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </TableCell>

                      {/* Subtotal */}
                      <TableCell className="text-right">
                        {(item.subtotalInCents / 100).toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </TableCell>
                    </TableRow>
                  ),
                )}
              </TableBody>

              <TableFooter>
                <TableRow>
                  <TableCell colSpan={3}>Total do pedido</TableCell>
                  <TableCell className="text-right font-medium">
                    {(order.totalInCents / 100).toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
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
