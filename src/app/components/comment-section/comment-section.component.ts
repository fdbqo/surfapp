import { Component, Input, type OnChanges, type SimpleChanges } from "@angular/core"
import { CommonModule } from "@angular/common"
import { MatCardModule } from "@angular/material/card"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { MatDividerModule } from "@angular/material/divider"
import { MatMenuModule } from "@angular/material/menu"
import { RouterModule } from "@angular/router"
import { FormsModule } from "@angular/forms"
import { ApiService } from "@/app/services/api.service"
import { AnalyticsService } from "@/app/services/analytics.service"

@Component({
  selector: "app-comment-section",
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatMenuModule,
    RouterModule,
    FormsModule,
  ],
  templateUrl: "./comment-section.component.html",
  styleUrls: ["./comment-section.component.css"],
})
export class CommentSectionComponent implements OnChanges {
  @Input() comments: any[] = []
  @Input() currentUser: any = null
  @Input() spotId = ""
  

  displayedComments: any[] = []
  replyingTo: string | null = null
  replyText = ""
  editingComment: string | null = null
  editText = ""

  commentsExpanded = true
  newCommentText = ""
  newCommentRating = 5

  constructor(
    private api: ApiService,
    private analytics: AnalyticsService
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["comments"]) {
      this.processComments()
    }
  }

  processComments(): void {
    this.displayedComments = [...this.comments].sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })

    const commentMap = new Map()
    const rootComments: any[] = []

    this.displayedComments.forEach((comment) => {
      comment.replies = []
      commentMap.set(comment._id, comment)
    })

    this.displayedComments.forEach((comment) => {
      if (comment.parentId && commentMap.has(comment.parentId)) {
        commentMap.get(comment.parentId).replies.push(comment)
      } else {
        rootComments.push(comment)
      }
    })

    this.displayedComments = rootComments
  }

  getStarRating(rating: number): string {
    if (!rating) return ""
    return "★".repeat(Math.floor(rating)) + "☆".repeat(5 - Math.floor(rating))
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.round(diffMs / 60000)
    const diffHours = Math.round(diffMs / 3600000)
    const diffDays = Math.round(diffMs / 86400000)

    if (diffMins < 60) {
      return diffMins === 1 ? "1 minute ago" : `${diffMins} minutes ago`
    } else if (diffHours < 24) {
      return diffHours === 1 ? "1 hour ago" : `${diffHours} hours ago`
    } else if (diffDays < 7) {
      return diffDays === 1 ? "1 day ago" : `${diffDays} days ago`
    } else {
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    }
  }


  startReply(commentId: string): void {
    this.replyingTo = commentId
    this.replyText = ""
    this.editingComment = null
  }

  cancelReply(): void {
    this.replyingTo = null
    this.replyText = ""
  }

  submitReply(parentComment: any): void {
    if (!this.replyText.trim()) return

    const reply = {
      text: this.replyText,
      parentId: parentComment._id,
      spotId: this.spotId,
      rating: 0,
    }

    this.api.postComment(reply).subscribe({
      next: (response) => {
        parentComment.replies.unshift({
          ...response,
          user: this.currentUser,
          createdAt: new Date().toISOString(),
          replies: [],
        })

        this.analytics.trackCommentPosted('reply', this.spotId);


        this.cancelReply()
      },
      error: (err) => {
        console.error("Error posting reply:", err)
        alert("Failed to post reply. Please try again.")
      },
    })
  }

  startEdit(comment: any): void {
    this.editingComment = comment._id
    this.editText = comment.text
    this.replyingTo = null
  }

  cancelEdit(): void {
    this.editingComment = null
    this.editText = ""
  }

  submitEdit(comment: any): void {
    if (!this.editText.trim()) return

    const updatedComment = {
      ...comment,
      text: this.editText,
    }

    this.api.updateComment(comment._id, updatedComment).subscribe({
      next: () => {
        comment.text = this.editText
        comment.edited = true

        this.analytics.trackCommentEdited(comment._id, this.spotId);

        this.cancelEdit()
      },
      error: (err) => {
        console.error("Error updating comment:", err)
        alert("Failed to update comment. Please try again.")
      },
    })
  }

  deleteComment(comment: any, parentComment?: any): void {
    if (confirm("Are you sure you want to delete this comment?")) {
      this.api.deleteComment(comment._id).subscribe({
        next: () => {

          this.analytics.trackCommentDeleted(comment._id, this.spotId);
          
          if (parentComment) {
            const index = parentComment.replies.findIndex((c: any) => c._id === comment._id)
            if (index !== -1) {
              parentComment.replies.splice(index, 1)
            }
          } else {
            const index = this.displayedComments.findIndex((c) => c._id === comment._id)
            if (index !== -1) {
              this.displayedComments.splice(index, 1)
            }
          }
        },
        error: (err) => {
          console.error("Error deleting comment:", err)
          alert("Failed to delete comment. Please try again.")
        },
      })
    }
  }

  canModify(comment: any): boolean {
    if (!this.currentUser) return false
    return this.currentUser._id === comment.user._id || this.currentUser.role === "admin"
  }

  // New methods for accordion style
  toggleComments(): void {
    this.commentsExpanded = !this.commentsExpanded
  }

  setRating(rating: number): void {
    this.newCommentRating = rating
  }

  submitComment(): void {
    if (!this.newCommentText.trim()) return

    const commentData: any = {
      text: this.newCommentText,
      spotId: this.spotId
    }

    if (this.replyingTo) {
      commentData.parentId = this.replyingTo

      // Find the parent comment
      const parentComment = this.findCommentById(this.replyingTo)

      if (parentComment) {
        this.api.postComment(commentData).subscribe({
          next: (response) => {
            const newReply = {
              ...response,
              user: this.currentUser,
              createdAt: new Date().toISOString(),
              replies: []
            }

            if (!parentComment.replies) {
              parentComment.replies = []
            }

            parentComment.replies.unshift(newReply)


            this.newCommentText = ""
            this.replyingTo = null
          },
          error: (err) => {
            console.error("Error posting reply:", err)
            alert("Failed to post reply. Please try again.")
          }
        })
      }
    } else {
      commentData.rating = this.newCommentRating

      this.api.postComment(commentData).subscribe({
        next: (response) => {
          const newComment = {
            ...response,
            user: this.currentUser,
            createdAt: new Date().toISOString(),
            replies: []
          }

          this.displayedComments.unshift(newComment)

          this.analytics.trackCommentPosted('comment', this.spotId);

          this.newCommentText = ""
          this.newCommentRating = 5
        },
        error: (err) => {
          console.error("Error posting comment:", err)
          alert("Failed to post comment. Please try again.")
        }
      })
    }
  }

  findCommentById(commentId: string): any {
    for (const comment of this.displayedComments) {
      if (comment._id === commentId) {
        return comment
      }

      if (comment.replies) {
        for (const reply of comment.replies) {
          if (reply._id === commentId) {
            return reply
          }
        }
      }
    }

    return null
  }
}