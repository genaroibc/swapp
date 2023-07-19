export function Loader({ title = "loading" }) {
  return (
    <div className="mx-auto my-12">
      <p className="font-medium text-xl text-center">{title}</p>
    </div>
  )
}
