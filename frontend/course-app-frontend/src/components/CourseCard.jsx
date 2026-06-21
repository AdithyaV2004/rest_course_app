export default function CourseCard({ course, footer }) {
  return (
    <div className="flex flex-col justify-between rounded-xl border border-stone-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div>
        <h3 className="text-lg font-semibold text-stone-900">{course.title}</h3>
        <p className="mt-1 text-sm text-stone-500">{course.description}</p>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <span className="text-base font-semibold text-stone-900">₹{course.price}</span>
        {footer}
      </div>
    </div>
  );
}
