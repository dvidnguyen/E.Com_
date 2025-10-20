import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button'
import { ChartColumnBig, Box, FileText, UsersRound, TicketPercent, ChevronUp } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function AdminHeader() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const timeoutRef = useRef<number | null>(null);

  const handleMouseEnter = (dropdownName: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setActiveDropdown(dropdownName);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150); 
  };

  const handleDropdownMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  return (
    <div className='p-3 border-b flex items-center justify-between fixed top-0 left-0 right-0 bg-white z-10 shadow-sm'>
      <div className='flex items-center gap-2 padding-left-2 '>
        <img
          src='https://cdn.shadcnstudio.com/ss-assets/logo/logo-square.png'
          className='size-10.5 rounded-lg'
          alt='logo'
        />
        <div className='text-xl font-medium '>
          E.Com_
        </div>
        <div className='flex flex-row gap-1 pt-0.5'>
          <Link to="/admin/dashboard">
            <Button
              variant='ghost'
              className='bg-transparent border-0 hover:bg-gray-100 focus:bg-gray-100 data-[state=open]:bg-gray-100 shadow-none focus-visible:ring-0 group'
            >
              <ChartColumnBig />
              Dashboard
            </Button>
          </Link>

          {/* Product Dropdown */}
          <div
            onMouseEnter={() => handleMouseEnter('product')}
            onMouseLeave={handleMouseLeave}
          >
            <DropdownMenu
              open={activeDropdown === 'product'}
              onOpenChange={(open) => setActiveDropdown(open ? 'product' : null)}
              modal={false}
            >
              <DropdownMenuTrigger asChild>
                <Button
                  variant='ghost'
                  className='bg-transparent border-0 hover:bg-gray-100 focus:bg-gray-100 data-[state=open]:bg-gray-100 shadow-none focus-visible:ring-0 group'
                >
                  <Box />
                  Product
                  <ChevronUp
                    className={`w-3 h-3 transition-transform duration-200 ${activeDropdown === 'product' ? 'rotate-180' : ''
                      }`}
                    strokeWidth={1.5}
                  />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align='start'
                className='animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 w-56 duration-200'
                onMouseEnter={handleDropdownMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    All products
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    Create product
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    Categories
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    Inventory
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Order Dropdown */}
          <div
            onMouseEnter={() => handleMouseEnter('order')}
            onMouseLeave={handleMouseLeave}
          >
            <DropdownMenu
              open={activeDropdown === 'order'}
              onOpenChange={(open) => setActiveDropdown(open ? 'order' : null)}
              modal={false}
            >
              <DropdownMenuTrigger asChild>
                <Button
                  variant='ghost'
                  className='bg-transparent border-0 hover:bg-gray-100 focus:bg-gray-100 data-[state=open]:bg-gray-100 shadow-none focus-visible:ring-0 group'
                >
                  <FileText />
                  Order
                  <ChevronUp
                    className={`w-3 h-3 transition-transform duration-200 ${activeDropdown === 'order' ? 'rotate-180' : ''
                      }`}
                    strokeWidth={1.5}
                  />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align='start'
                className='animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 w-56 duration-200'
                onMouseEnter={handleDropdownMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    All Orders
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    Pending Orders
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    Completed Orders
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    Cancel Orders
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Customers Dropdown */}
          <div
            onMouseEnter={() => handleMouseEnter('customers')}
            onMouseLeave={handleMouseLeave}
          >
            <DropdownMenu
              open={activeDropdown === 'customers'}
              onOpenChange={(open) => setActiveDropdown(open ? 'customers' : null)}
              modal={false}
            >
              <DropdownMenuTrigger asChild>
                <Button
                  variant='ghost'
                  className='bg-transparent border-0 hover:bg-gray-100 focus:bg-gray-100 data-[state=open]:bg-gray-100 shadow-none focus-visible:ring-0 group'
                >
                  <UsersRound />
                  Customers
                  <ChevronUp
                    className={`w-3 h-3 transition-transform duration-200 ${activeDropdown === 'customers' ? 'rotate-180' : ''
                      }`}
                    strokeWidth={1.5}
                  />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align='start'
                className='animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 w-56 duration-200'
                onMouseEnter={handleDropdownMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    List Customers
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    Feedbacks
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Voucher Dropdown */}
          <div
            onMouseEnter={() => handleMouseEnter('voucher')}
            onMouseLeave={handleMouseLeave}
          >
            <DropdownMenu
              open={activeDropdown === 'voucher'}
              onOpenChange={(open) => setActiveDropdown(open ? 'voucher' : null)}
              modal={false}
            >
              <DropdownMenuTrigger asChild>
                <Button
                  variant='ghost'
                  className='bg-transparent border-0 hover:bg-gray-100 focus:bg-gray-100 data-[state=open]:bg-gray-100 shadow-none focus-visible:ring-0 group'
                >
                  <TicketPercent />
                  Voucher
                  <ChevronUp
                    className={`w-3 h-3 transition-transform duration-200 ${activeDropdown === 'voucher' ? 'rotate-180' : ''
                      }`}
                    strokeWidth={1.5}
                  />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align='start'
                className='animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 w-56 duration-200'
                onMouseEnter={handleDropdownMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    Create Voucher
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    Edit Voucher
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* User Avatar */}
      <div>
        <Button variant='ghost' size='icon' className='size-9.5'>
          <Avatar className='size-9.5 rounded-md'>
            <AvatarImage src='https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-1.png' />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
        </Button>
      </div>
    </div>
  );
}
