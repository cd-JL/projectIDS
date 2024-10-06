import Footer from "@/app/_components/footer";
import Fetch_json from "@/app/_components/get-json";
import NavBar from "@/app/_components/nav-bar";


export default function GetQuote() {
  return (
    <main>
      <NavBar />
      <Fetch_json />
      <Footer />
    </main>
  )
}