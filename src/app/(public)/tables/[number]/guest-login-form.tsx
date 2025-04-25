'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  GuestLoginBody,
  GuestLoginBodyType,
} from '@/schemaValidations/guest.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

export default function GuestLoginForm() {
  const form = useForm<GuestLoginBodyType>({
    resolver: zodResolver(GuestLoginBody),
    defaultValues: {
      name: '',
      token: '',
      tableNumber: 1,
    },
  })
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
