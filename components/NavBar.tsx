import Image from 'tailwindcss'
import Link from 'next/link'
import { Dropdown, Navbar,Avatar } from 'flowbite-react';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';

export default function NavBar(){

  const session = useSession()
  const supabase = useSupabaseClient()


return(
    <Navbar
      fluid
      rounded
    >
      <Navbar.Brand href="/">
      <img src="https://flowbite.com/docs/images/logo.svg" className="h-8 mr-3" alt="Flowbite Logo" />
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
          3DED
        </span>
      </Navbar.Brand>
      <div className="flex md:order-2">
      {!session ? (
        <p>Login</p>
        ) : (
        <Dropdown
          inline
          label={<Avatar alt="User settings" img="/images/avatar1.png" rounded/>}
        >
          <Dropdown.Header>
            <span className="block truncate text-sm font-medium">
            {session.user.email}
            </span>
          </Dropdown.Header>
          <Dropdown.Item>
          <Link href="/my-bookings">My bookings</Link>
          </Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item onClick={async () => {
                const { error } = await supabase.auth.signOut()
                if (error) console.log('Error logging out:', error.message)
              }}>
            Sign out
          </Dropdown.Item>
        </Dropdown>)}

        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        {/* <Navbar.Link
          active
          href="#"
        >
          <p>
            Home
          </p>
        </Navbar.Link> */}
        {/* <Navbar.Link href="/view-all" className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">View bookings</Navbar.Link> */}
        </Navbar.Collapse>
    </Navbar>
)
}