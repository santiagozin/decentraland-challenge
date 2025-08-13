import { Footer, Navbar } from 'decentraland-ui'


const Layout = ({children}) => {
  return (
    <div>
    <Navbar activePage='marketplace' />
    {children}
    <Footer isFullWidth={true}/>
    </div>
  )
}

export default Layout