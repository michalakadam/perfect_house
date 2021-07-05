import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  ViewChild,
} from "@angular/core";
import { Paginator } from "primeng/paginator";
import { OFFERS_PER_PAGE } from "src/app/shared/constants";

@Component({
  selector: "perfect-paginator",
  templateUrl: "./paginator.component.html",
  styleUrls: ["./paginator.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginatorComponent {
  offersPerPage = OFFERS_PER_PAGE;
  @Input() totalOffersQuantity = 0;
  @Input()
  public set selectedPage(page: number) {
    this.updateCurrentPage(page);
  }
  @Output() pageChanged = new EventEmitter<number>();

  @ViewChild("paginator", { static: true }) paginator: Paginator;

  private updateCurrentPage(currentPage: number): void {
    setTimeout(() => this.paginator.changePage(currentPage));
  }
}
