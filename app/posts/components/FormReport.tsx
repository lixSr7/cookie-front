"use client";
import React, { useState } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalContent,
  ModalFooter,
  Button,
  Textarea,
  Checkbox,
} from "@nextui-org/react";
import { toast } from "sonner";
import { reportPost } from "@/services/Posts";

const REPORT_REASONS = [
  "Spam",
  "Harassment",
  "Inappropriate Content",
  "False Information",
  "Other",
];

/**
 * FormReport Component
 *
 * This component renders a form inside a modal that allows users to report a post.
 * Users can select multiple reasons for the report, as well as provide additional details.
 *
 * @param {string} postId - The ID of the post to be reported.
 * @param {() => void} onClose - Function to close the modal.
 * @param {() => void} [updatePosts] - Optional function to update the list of posts after reporting.
 * @returns {JSX.Element} The rendered FormReport component.
 */
const FormReport = ({
  postId,
  onClose,
  updatePosts,
}: {
  postId: string;
  onClose: () => void;
  updatePosts?: () => void; // Hacer updatePosts opcional
}) => {
  // State to track selected reasons for reporting
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);

  // State to track custom reason input by the user
  const [customReason, setCustomReason] = useState("");

  // State to track whether the form is in the process of submitting
  const [isSending, setIsSending] = useState(false);

  /**
   * Handles the change of reason selection.
   * Adds or removes the reason from the selectedReasons array.
   *
   * @param {string} reason - The reason to add or remove from the selection.
   */
  const handleReasonChange = (reason: string) => {
    setSelectedReasons((prevReasons) =>
      prevReasons.includes(reason)
        ? prevReasons.filter((r) => r !== reason)
        : [...prevReasons, reason]
    );
  };

  /**
   * Handles the report submission.
   * Combines the selected reasons and custom reason, then sends the report.
   */
  const handleReport = async () => {
    setIsSending(true);
    // Combine selected reasons and custom reason into a single string
    const reason = [...selectedReasons, customReason]
      .filter(Boolean)
      .join(", ");

    try {
      // Attempt to report the post with the combined reasons
      await reportPost(postId, reason);
      if (updatePosts) {
        updatePosts(); // Update the posts list after reporting if updatePosts is defined
      }
      toast.success("Post reported successfully");
      onClose(); // Close the modal
    } catch (error) {
      console.error("Error reporting post:", error);
      toast.error("Failed to report the post");
    } finally {
      setIsSending(false); // Reset sending state
    }
  };

  return (
    <ModalContent>
      <ModalHeader className="flex flex-col gap-1 m-auto">
        Report Post
      </ModalHeader>
      <ModalBody>
        <div className="flex flex-col gap-4">
          {/* Render checkboxes for each predefined report reason */}
          {REPORT_REASONS.map((reason) => (
            <Checkbox
              key={reason}
              isSelected={selectedReasons.includes(reason)}
              onChange={() => handleReasonChange(reason)}
            >
              {reason}
            </Checkbox>
          ))}
          <Textarea
            className=" "
            placeholder="Add more details (optional)..."
            value={customReason}
            onChange={(e) => setCustomReason(e.target.value)}
            rows={4}
          />
        </div>
      </ModalBody>
      <ModalFooter>
        <Button
          color="primary"
          isDisabled={(!selectedReasons.length && !customReason) || isSending}
          isLoading={isSending}
          onClick={handleReport}
        >
          Report
        </Button>
      </ModalFooter>
    </ModalContent>
  );
};

export default FormReport;
