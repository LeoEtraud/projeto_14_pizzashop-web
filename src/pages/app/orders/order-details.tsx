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

// Converte valores possíveis para centavos (número)
function toCents(raw: unknown): number {
  if (raw == null) return 0;
  if (typeof raw === "number" && Number.isFinite(raw)) return Math.round(raw);

  const s = String(raw).trim();
  if (!s) return 0;

  // Se contiver vírgula/ponto, tratamos como reais (ex.: "50,00", "50.00")
  if (/[.,]/.test(s)) {
    const reais = parseFloat(s.replace(/\./g, "").replace(",", "."));
    return Number.isFinite(reais) ? Math.round(reais * 100) : 0;
  }

  // Caso contrário, interpretamos como inteiro de centavos (ex.: "5000")
  const n = Number(s);
  return Number.isFinite(n) ? Math.round(n) : 0;
}

type UIItem = {
  id: string;
  name: string;
  quantity: number;
  unitPriceInCents: number;
  subtotalInCents: number;
};

export function OrderDetails({ orderId, open }: OrderDetailsProps) {
  const { data: order } = useQuery({
    queryKey: ["order", orderId],
    queryFn: () => getOrderDetails({ orderId }),
    enabled: open,
    // Normaliza tudo que a UI precisa
    select: (o: any) => {
      const items: UIItem[] = (o?.orderItems ?? []).map((it: any) => {
        const quantity = Number(it?.quantity ?? 0);
        const unitPriceInCents = toCents(
          it?.priceInCents ?? it?.unitPriceInCents ?? it?.price,
        );
        return {
          id: String(it?.id),
          name: it?.product?.name ?? it?.name ?? "—",
          quantity,
          unitPriceInCents,
          subtotalInCents: unitPriceInCents * quantity,
        };
      });

      return {
        ...o,
        createdAt: new Date(o?.createdAt),
        totalInCents: toCents(o?.totalInCents ?? o?.total ?? 0),
        orderItems: items,
      };
    },
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
                    {formatDistanceToNow(order.createdAt, {
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
                {order.orderItems.map((item: UIItem) => (
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
                ))}
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
