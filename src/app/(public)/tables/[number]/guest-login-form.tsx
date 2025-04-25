'use client'

import { useAppContext } from '@/components/app-provider'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { decodeToken, handleErrorApi } from '@/lib/utils'
import { useGuestLoginMutation } from '@/queries/useGuest'
import {
  GuestLoginBody,
  GuestLoginBodyType,
} from '@/schemaValidations/guest.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

export default function GuestLoginForm() {
  const searchParams = useSearchParams()
  const params = useParams()
  const tableNumber = Number(params.number)
  const token = searchParams.get('token')
  const router = useRouter()
  const loginMutation = useGuestLoginMutation()
  const { setRole } = useAppContext()
  const form = useForm<GuestLoginBodyType>({
    resolver: zodResolver(GuestLoginBody),
    defaultValues: {
      name: '',
      token: token ?? '',
      tableNumber,
    },
  })

  useEffect(() => {
    if (!token) {
      router.push('/')
    }
  }, [token, router])

  const onSubmit = async (values: GuestLoginBodyType) => {
    if (loginMutation.isPending) return
    try {
      const result = await loginMutation.mutateAsync(values)
      const role = decodeToken(result.payload.data.accessToken).role
      setRole(role)
      router.push('/guest/menu')
    } catch (error) {
      handleErrorApi({
        error,
        setError: form.setError,
      })
    }
  }

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle>Đăng nhập để gọi món</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            noValidate
            className="space-y-2 max-w-[600px] flex-shrink-0 w-full"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="name">Tên khách hàng</Label>
                    <Input id="name" type="text" required {...field} />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                Đăng nhập
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
