import "bootstrap/dist/css/bootstrap.min.css"

import Link from "next/link"
import Container from "react-bootstrap/Container"
import Navbar from "react-bootstrap/Navbar"
import Nav from "react-bootstrap/Nav"

export default function Layout({ children }) {
  return (
    <>
      <Navbar bg="dark" expand="lg">
        <Container>
          <Link href="/">
            <Navbar.Brand className="text-light">
              {" "}
              Shared Checklist{" "}
            </Navbar.Brand>
          </Link>
        </Container>
      </Navbar>
      <Container className="mt-3">{children}</Container>
    </>
  )
}
