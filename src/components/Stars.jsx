export default function Stars({ rating }) {
  const stars = [1, 2, 3, 4, 5].map((n) => (n <= rating ? '★' : '☆')).join('')
  return (
    <span className="stars" aria-label={`${rating} out of 5 stars`}>
      {stars}
    </span>
  )
}
