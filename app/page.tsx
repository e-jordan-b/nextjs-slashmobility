import Link from "next/link";

export default function Home(){
  return (
    <div className="home-container">
      <h1 className="home-title">Range Component Exercises</h1>
      <nav className="home-nav">
        <Link href="/exercise1" className="home-link">
          Exercise 1
        </Link>
        <Link href="/exercise2" className="home-link">
          Exercise 2
        </Link>
      </nav>
    </div>
  )
}
