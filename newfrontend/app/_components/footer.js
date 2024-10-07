import Link from "next/link";

export default function Footer() {
  return (
    <>
      <footer className="footer flex justify-between p-40 bg-black text-white mt-10">
        <div className="">
          <p>Logo</p>
          <p className="text-2xl pt-4">
            Project IDS
          </p>
          <div className="pt-4 text-lg">
            <p>CALGARY, ALBERTA</p>
            <p>ProjectIDS225@GMAIL.COM</p>
            <p>+1 (123) 456 7890</p>
          </div>

          <p>CANADA</p>
          <div className="text-sm pt-4">
            <p>@2024 Project IDS Company</p>
            <p>Project IDS Company is registered in Canada</p>
            <p>Company number: 123456789</p>
          </div>
        </div>
       
      </footer>
    </>
  );
}
