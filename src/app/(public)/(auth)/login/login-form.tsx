'use client'

import { useAppContext } from '@/components/app-provider'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from '@/hooks/use-toast'
import { handleErrorApi, removeTokenFromLocalStorage } from '@/lib/utils'
import { useLoginMutation } from '@/queries/useAuth'
import { LoginBody, LoginBodyType } from '@/schemaValidations/auth.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

export default function LoginForm() {
  const loginMutation = useLoginMutation()
  const searchParams = useSearchParams()
  const clearTokens = searchParams.get('clearTokens')
  const { setRole } = useAppContext()
  const router = useRouter()
  const form = useForm<LoginBodyType>({
    resolver: zodResolver(LoginBody),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  useEffect(() => {
    if (clearTokens) {
      setRole()
    }
  }, [clearTokens, setRole])

  const onSubmit = async (data: LoginBodyType) => {
    if (loginMutation.isPending) return
    try {
      const result = await loginMutation.mutateAsync(data)
      setRole(result.payload.data.account.role)
      toast({
        description: result.payload.message,
      })
      router.push('/manage/dashboard')
    } catch (error: any) {
      handleErrorApi({
        error,
        setError: form.setError,
      })
    }
  }

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Đăng nhập</CardTitle>
        <CardDescription>
          Nhập email và mật khẩu của bạn để đăng nhập vào hệ thống
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            className="space-y-2 max-w-[600px] flex-shrink-0 w-full"
            noValidate
            onSubmit={form.handleSubmit(onSubmit, (err) => {
              console.log(err)
            })}
          >
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      placeholder="email"
                      type="email"
                      required
                      {...field}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      placeholder="password"
                      {...field}
                      type="password"
                      required
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                Đăng nhập
              </Button>
              <Button variant="outline" className="w-full" type="button">
                Đăng nhập bằng Google
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
