'use client';

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Trash2 } from 'lucide-react';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@rahat-ui/shadcn/components/table';
import { UUID } from 'crypto';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useContext } from 'react';
import { useConfirm } from '../../components/swal';
import {
  ServiceContext,
  ServiceContextType,
} from '../../providers/service.provider';
dayjs.extend(relativeTime);

export type Role = {
  id: string;
  role: string;
};

interface ColumnDefinitionHandlerProps {
  handleDelete: () => void;
}

export function ColumnDefinitionHandler({
  handleDelete,
}: ColumnDefinitionHandlerProps): ColumnDef<Role>[] {
  const columns: ColumnDef<Role>[] = [
    {
      accessorKey: 'name',
      header: 'Role',
      size: 20,
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue('name')}</div>
      ),
    },
    {
      accessorKey: 'expiry',
      header: 'Expiry Date',
      size: 20,
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue('expiry')}</div>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: 'Added On',
      size: 20,
      cell: ({ row }) => (
        <div className="capitalize">
          {dayjs(row.getValue('createdAt')).fromNow()}
        </div>
      ),
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <div className="flex justify-end">
            <Trash2
              className="cursor-pointer"
              strokeWidth={1.6}
              size={16}
              onClick={handleDelete}
            />
          </div>
        );
      },
    },
  ];
  return columns;
}

type Props = {
  uuid: UUID;
};

export function UsersRoleTable(props: Props) {
  const { userQuery } = useContext(ServiceContext) as ServiceContextType;

  const { data: roleData } = userQuery.useUserRoleList(props.uuid);
  userQuery.useUserRolesRemove();
  const confirm = useConfirm({
    title: 'Are you sure?',
    text: 'User needs to re-login to apply changes.',
    confirmButtonText: 'Confirm Removal',
  });
  const handleDelete = () => {
    confirm({}).then((result) => {
      if (result.isConfirmed) console.log('test');
    });
  };
  const columns = ColumnDefinitionHandler({
    handleDelete,
  });

  const table = useReactTable({
    data: roleData?.data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (!roleData) return <></>;

  return (
    <div className="w-full border">
      <Table>
        <TableHeader className="sticky top-0">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
