import React, { useEffect } from "react";

const RedirectForm = ({ epayUrl, payload }) => {
  useEffect(() => {
    // Automatically submit the form when the component mounts
    const form = document.getElementById("redirectForm");
    if (form) {
      form.submit();
    }
  }, []);

  return (
    <form id="redirectForm" action={epayUrl} method="post">
      {Object.entries(payload).map(([key, value]) => (
        <input key={key} type="hidden" name={key} value={value} />
      ))}
    </form>
  );
};

export default RedirectForm;
