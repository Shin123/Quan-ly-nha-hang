import tableApiRequest from '@/apiRequests/table'
import { UpdateTableBodyType } from '@/schemaValidations/table.schema'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const useTableListQuery = () => {
  return useQuery({
    queryKey: ['table-list'],
    queryFn: tableApiRequest.list,
  })
}

export const useGetTableDetail = ({ id }: { id: number }) => {
  return useQuery({
    queryKey: ['table-detail', id],
    queryFn: () => tableApiRequest.getTable(id),
    enabled: !!id,
  })
}

export const useAddTableMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: tableApiRequest.add,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['table-list'],
      })
    },
  })
}

export const useUpdateTableMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...body }: UpdateTableBodyType & { id: number }) =>
      tableApiRequest.updateTable(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['table-list'],
      })
    },
  })
}

export const useDeleteTableMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: tableApiRequest.deleteTable,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['table-list'],
      })
    },
  })
}
