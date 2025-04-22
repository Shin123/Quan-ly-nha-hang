import dishApiRequest from '@/apiRequests/dish'
import {
  UpdateDishBody,
  UpdateDishBodyType,
} from '@/schemaValidations/dish.schema'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const useGetDishList = () => {
  return useQuery({
    queryKey: ['dish-list'],
    queryFn: dishApiRequest.list,
  })
}

export const useGetDishDetail = ({ id }: { id: number }) => {
  return useQuery({
    queryKey: ['dish-detail', id],
    queryFn: () => dishApiRequest.getDish(id),
    enabled: !!id,
  })
}

export const useAddDishMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: dishApiRequest.add,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['dish-list'],
      })
    },
  })
}

export const useUpdateDishMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...body }: UpdateDishBodyType & { id: number }) =>
      dishApiRequest.updateDish(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['dish-list'],
      })
    },
  })
}

export const useDeleteDishMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: dishApiRequest.deleteDish,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['dish-list'],
      })
    },
  })
}
