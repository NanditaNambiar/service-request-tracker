import React from 'react';
import type { RequestDTO } from '../types/api';


export default function RequestCard({ request }: { request: RequestDTO }) {
return (
<div className="border rounded p-4 shadow-sm">
<h3 className="font-semibold">{request.title}</h3>
<p className="text-sm">{request.description}</p>
<div className="mt-2 text-xs text-gray-600">
<span>Category: {request.categoryName}</span> • <span>Raised by: {request.createdByName}</span>
<div>Assigned: {request.handledByName || '—'}</div>
<div>Status: {request.status ? 'Open' : 'Closed'}</div>
</div>
</div>
);
}