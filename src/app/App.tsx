

import 'decentraland-ui/lib/styles.css'
import Layout from './components/Layout'
import SignIn from './modules/signIn/SignIn'
import { useAccount } from 'wagmi';
import Account from './modules/account/Account';


export default function App() {
  const { isConnected } = useAccount();
  
  return (
    <Layout>
      {!isConnected ? <SignIn /> : <Account />}
    </Layout>
  )
}
