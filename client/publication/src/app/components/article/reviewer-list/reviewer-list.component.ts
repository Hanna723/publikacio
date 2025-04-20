import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { RoleName } from 'src/app/shared/models/Role';
import { UserService } from 'src/app/shared/services/user.service';

export interface TableReviewer {
  _id: string;
  name: string;
}

@Component({
  selector: 'app-reviewer-list',
  imports: [CommonModule, MatButtonModule, MatIconModule, MatTableModule],
  templateUrl: './reviewer-list.component.html',
  styleUrl: './reviewer-list.component.scss',
})
export class ReviewerListComponent implements OnInit {
  @Input() reviewers: string[] = [];
  @Input() userRole?: RoleName | string;
  tableReviewers: TableReviewer[] = [];
  displayedColumns: string[] = ['name', 'action'];
  isEditor = false;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.isEditor = this.userRole === RoleName.EDITOR;
    this.reviewers.forEach((id) => {
      this.userService.getUserById(id).subscribe((user) => {
        const tableReviewer: TableReviewer = {
          _id: id,
          name: user.firstName + ' ' + user.lastName,
        };

        this.tableReviewers.push(tableReviewer);
      });
    });
  }

  newReviewer(): void {}

  deleteReviewer(): void {}
}
