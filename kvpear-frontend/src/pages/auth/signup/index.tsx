import LoginSignupForm from "@/components/common/Forms/LoginSignupForm/LoginSignupForm";
import Link from "next/link";


export default function Signup() {
  return (
    <LoginSignupForm 
      title="Sign Up" 
      subtitle="We'll send a link to your email that you can use to log in instantly. No credit card required." 
    >
      <div style={{ marginTop: '30px', fontSize: '14px' }}>
        <div>By signing up, you agree to our <Link href="/policies/terms-of-service">Terms of Service </Link>
         and <Link href="/policies/privacy-policy">Privacy Policy</Link></div>
      </div>
    </LoginSignupForm>
  )
}