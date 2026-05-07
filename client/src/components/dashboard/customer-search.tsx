"use client";

import * as React from "react";
import { Check, ChevronsUpDown, UserPlus, Search, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import api from "@/lib/api";

interface Customer {
  id: string;
  name: string | null;
  email: string | null;
  unpaidCount?: number;
  linkedServices?: any[];
}

interface CustomerSearchProps {
  onSelect: (customer: Customer | null, isNew: boolean, name?: string) => void;
  defaultValue?: string;
  placeholder?: string;
}

export function CustomerSearch({ onSelect, defaultValue, placeholder }: CustomerSearchProps) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(defaultValue || "");
  const [customers, setCustomers] = React.useState<Customer[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState("");
  const [newCustomerName, setNewCustomerName] = React.useState<string | null>(null);

  const fetchCustomers = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/customers?limit=1000&sortBy=name");
      if (res.data.success) {
        setCustomers(res.data.obj);
      }
    } catch (error) {
      console.error("Failed to fetch customers", error);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const selectedCustomer = customers.find((c) => c.id === value);
  const displayValue = selectedCustomer 
    ? (selectedCustomer.name || selectedCustomer.email) 
    : newCustomerName;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between font-normal"
        >
          {displayValue ? (
            <div className="flex items-center gap-2 truncate">
              <User className="h-4 w-4 text-orange-500" />
              <span>{displayValue}</span>
            </div>
          ) : (
            <span className="text-muted-foreground">{placeholder || "Select customer..."}</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput 
            placeholder="Search name or email..." 
            value={searchValue}
            onValueChange={setSearchValue}
          />
          <CommandList>
            <CommandEmpty className="py-2 px-4">
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 h-9 px-2 text-orange-500 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-500/10"
                onClick={() => {
                  setNewCustomerName(searchValue);
                  setValue("");
                  onSelect(null, true, searchValue);
                  setOpen(false);
                }}
              >
                <UserPlus className="h-4 w-4" />
                <span>Create new customer "{searchValue}"</span>
              </Button>
            </CommandEmpty>
            <CommandGroup>
              {customers
                .filter(c => 
                  (c.name?.toLowerCase().includes(searchValue.toLowerCase())) || 
                  (c.email?.toLowerCase().includes(searchValue.toLowerCase()))
                )
                .slice(0, 10) // Show top 10 matches
                .map((customer) => (
                <CommandItem
                  key={customer.id}
                  value={customer.id}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                    setNewCustomerName(null);
                    onSelect(customer, false);
                    setOpen(false);
                  }}
                  className="flex items-center justify-between"
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{customer.name || "Unnamed"}</span>
                    <span className="text-[10px] text-muted-foreground">{customer.email || "No email"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {customer.unpaidCount ? (
                      <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full dark:bg-red-500/20">
                        {customer.unpaidCount} unpaid
                      </span>
                    ) : null}
                    {customer.linkedServices && customer.linkedServices.length > 0 && (
                      <span className="text-[10px] bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded-full dark:bg-blue-500/20">
                        {customer.linkedServices.length} {customer.linkedServices.length === 1 ? 'client' : 'clients'}
                      </span>
                    )}
                    <Check
                      className={cn(
                        "h-4 w-4",
                        value === customer.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
            {searchValue && !customers.some(c => c.name === searchValue || c.email === searchValue) && (
               <CommandGroup heading="Actions">
                 <CommandItem
                   onSelect={() => {
                     setNewCustomerName(searchValue);
                     setValue("");
                     onSelect(null, true, searchValue);
                     setOpen(false);
                   }}
                   className="text-orange-500"
                 >
                   <UserPlus className="mr-2 h-4 w-4" />
                   Create new "{searchValue}"
                 </CommandItem>
               </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
