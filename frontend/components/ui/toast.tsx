"use client"

import * as React from "react"
import * as ToastPrimitive from "@radix-ui/react-toast"
import { cn } from "@/lib/utils"

const ToastProvider = ToastPrimitive.Provider

const ToastViewport = React.forwardRef<
    React.ComponentRef<typeof ToastPrimitive.Viewport>,
    React.ComponentProps<typeof ToastPrimitive.Viewport>
>(({ className, ...props }, ref) => (
    <ToastPrimitive.Viewport
        ref={ref}
        className={cn(
            "fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]",
            className
        )}
        {...props}
    />
))
ToastViewport.displayName = "ToastViewport"

const Toast = React.forwardRef<
    React.ComponentRef<typeof ToastPrimitive.Root>,
    React.ComponentProps<typeof ToastPrimitive.Root>
>(({ className, ...props }, ref) => (
    <ToastPrimitive.Root
        ref={ref}
        className={cn(
            "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border bg-background p-6 pr-8 shadow-lg transition-all",
            className
        )}
        {...props}
    />
))
Toast.displayName = "Toast"

const ToastTitle = React.forwardRef<
    React.ComponentRef<typeof ToastPrimitive.Title>,
    React.ComponentProps<typeof ToastPrimitive.Title>
>(({ className, ...props }, ref) => (
    <ToastPrimitive.Title
        ref={ref}
        className={cn("text-sm font-semibold", className)}
        {...props}
    />
))
ToastTitle.displayName = "ToastTitle"

const ToastDescription = React.forwardRef<
    React.ComponentRef<typeof ToastPrimitive.Description>,
    React.ComponentProps<typeof ToastPrimitive.Description>
>(({ className, ...props }, ref) => (
    <ToastPrimitive.Description
        ref={ref}
        className={cn("text-sm text-muted-foreground", className)}
        {...props}
    />
))
ToastDescription.displayName = "ToastDescription"

const ToastClose = React.forwardRef<
    React.ComponentRef<typeof ToastPrimitive.Close>,
    React.ComponentProps<typeof ToastPrimitive.Close>
>(({ className, ...props }, ref) => (
    <ToastPrimitive.Close
        ref={ref}
        className={cn(
            "absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 group-hover:opacity-100",
            className
        )}
        {...props}
    >
        ✕
    </ToastPrimitive.Close>
))
ToastClose.displayName = "ToastClose"

export {
    ToastProvider,
    ToastViewport,
    Toast,
    ToastTitle,
    ToastDescription,
    ToastClose,
}