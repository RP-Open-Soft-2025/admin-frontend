<TableCell className="px-5 py-4 sm:px-6 text-start">
  <div className="flex items-center gap-3">
    <Link href={`/sessions/${session.employee_id}/${session.session_id}`}>
      <Video className="w-6 h-6 text-gray-500 dark:text-gray-400" />
    </Link>
    <div>
      <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
        {session.session_id}
      </span>
      <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
        {session.created_at
          ? new Date(session.created_at).toLocaleDateString()
          : new Date(
              session.scheduled_at
            ).toLocaleDateString()}
      </span>
    </div>
  </div>
</TableCell> 