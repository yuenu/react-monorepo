import { Calendar } from "calendar";
import { Button } from 'button'
import Link from 'next/link'

export default function Web() {
  return (
    <div className="grid w-screen h-screen gap-10 place-content-center">
      <Button />
      <Link href="calendar">Calendat component</Link>
      <Calendar />
    </div>
  );
}
