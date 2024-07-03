export default function Home() {
  return (
    <main>
      <div className=' flex flex-col space-y-2 text-center align-middle '>
        <h1>Mango on Sticky rice&#39;s MakeX Timer to live boardcast</h1>
        <a href="/judge" className=' text-pink-400 hover:text-teal-300'>Judge Page</a><br />
        <a href="/bigscreen" className=' text-pink-400 hover:text-teal-300'>BigScreen Monitor Page</a><br />
        <a href="/overlay" className=' text-pink-400 hover:text-teal-300'>OBS Overlay</a>
      </div>
    </main>
  )
}
