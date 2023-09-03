import LoginSignupForm from "@/components/common/Forms/LoginSignupForm/LoginSignupForm";
import Link from "next/link";


export default function Login() {
  return (
    <LoginSignupForm 
      title="Login to your account" 
      subtitle="We'll send a link to your email that you can use to log in instantly" 
    >
      <div style={{ marginTop: '30px', fontSize: '14px' }}>
        <div>Don't have an account? <Link href="/auth/signup">Sign up</Link></div>
      </div>
    </LoginSignupForm>
  )
}