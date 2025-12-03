export default function SuccessBox({ msg }) {
  if (!msg) return null;

  return (
    <div className="success-box">
      {msg}
    </div>
  );
}
