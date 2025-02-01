import { Dialog, DialogTrigger } from "@/components/dialog";
import { Button } from "@/components/ui/button";
import { TableRow, TableCell, TableHead } from "@/components/ui/table";
import { Search, ArrowRight, X } from "lucide-react";
import { OrderDetails } from "./order-details";
import { OrderStatus } from "@/components/order-status";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useState } from "react";

export interface OrderTableRowProps {
  order: {
    orderId: string;
    createdAt: string;
    status: "pending" | "canceled" | "processing" | "delivering" | "delivered";
    customerName: string;
    total: number;
  };
}

export function OrderTableRow({ order }: OrderTableRowProps) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  return (
    <TableRow>
      <TableCell>
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="xs">
              <Search className="h-3 w-3" />
              <span className="sr-only">Detalhes do pedido</span>
            </Button>
          </DialogTrigger>
          <OrderDetails open={isDetailsOpen} orderId={order.orderId} />
        </Dialog>
      </TableCell>
      <TableHead className="font-mono text-xs font-medium">
        {order.orderId}
      </TableHead>
      <TableHead className="text-muted-foreground">
        {formatDistanceToNow(order.createdAt, {
          locale: ptBR,
          addSuffix: true,
        })}
      </TableHead>
      <TableHead>
        <OrderStatus status={order.status} />
      </TableHead>
      <TableHead className="font-medium">{order.customerName}</TableHead>
      <TableHead className="font-medium">
        {(order.total / 100).toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        })}
      </TableHead>
      <TableHead>
        <Button variant="outline" size="xs">
          <ArrowRight className="mr-2 h-3 w-3" />
          Aprovar
        </Button>
      </TableHead>
      <TableHead>
        <Button variant="ghost" size="xs">
          <X className="mr-2 h-3 w-3" />
          Cancelar
        </Button>
      </TableHead>
    </TableRow>
  );
}
