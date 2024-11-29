import { Dialog, DialogTrigger } from "@/components/dialog";
import { Button } from "@/components/ui/button";
import { TableRow, TableCell, TableHead } from "@/components/ui/table";
import { Search, ArrowRight, X } from "lucide-react";
import { OrderDetails } from "./order-details";

export function OrderTableRow() {
  return (
    <TableRow>
      <TableCell>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="xs">
              <Search className="h-3 w-3" />
              <span className="sr-only">Detalhes do pedido</span>
            </Button>
          </DialogTrigger>
          <OrderDetails />
        </Dialog>
      </TableCell>
      <TableHead className="font-mono text-xs font-medium">
        2f12sf12asf21f2
      </TableHead>
      <TableHead className="text-muted-foreground">Há 15 minutos</TableHead>
      <TableHead>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-slate-400"></span>
          <span className="font-medium text-muted-foreground">Pendente</span>
        </div>
      </TableHead>
      <TableHead className="font-medium">Leonardo Neves Duarte</TableHead>
      <TableHead className="font-medium">R$ 159,00</TableHead>
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
