import Logo from "../components/Global/Logo";
import Bar from "../components/Login_Components/Bar";
import LoginBox from "../components/Login_Components/LoginBox/LoginBox";
import KWHeader from "../components/Login_Components/KWHeader/KWHeader"

function Login_Page() {
  const Loginy = 600;
  return (
    <div>
      <Logo/>
      <Bar/>
      <KWHeader/>
      <LoginBox Loginy={Loginy} />
    </div>
  );
}

export default Login_Page;
