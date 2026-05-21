import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { MatchResult } from '../../model/Enums';
import { Match } from '../../model/match.model';
import { MatchInput } from '../../model/inputs/matchInput';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-match-result-dialog-component',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './match-result-dialog-component.html',
  styleUrl: '../modal.css',
})
export class MatchResultDialogComponent {
  MatchResult = MatchResult;
  @Input({ required: true }) match!: Match;
  @Input() isDrawAllowed: boolean = false;

  @Output() submit = new EventEmitter<MatchInput>();
  @Output() close = new EventEmitter<void>();

  errorMessage = signal<string | null>("");

  matchInput: MatchInput = {
    id: '',
    score1: null,
    score2: null,
    result: MatchResult.Draw,
  };

  ngOnChanges() {
    if (!this.match) {
      this.close.emit();
      return;
    }
    this.matchInput = {
      id: this.match.id,
      score1: null,
      score2: null,
      result: MatchResult.Draw,
    };
  }

  closeResultDialog() {
    this.close.emit();
  }

  onSubmit() {
    if (this.matchInput.score1 === null || this.matchInput.score2 === null) {
      this.errorMessage.set("Score is required");
      return;
    }

    if (this.matchInput.result === MatchResult.Draw && !this.isDrawAllowed) {
      this.errorMessage.set("Draw is not allowed");
      return;
    }

    this.submit.emit(this.matchInput);
  }

  onScore1Type(value: number) {
    this.matchInput.score1 = value;
  }

  onScore2Type(value: number) {
    this.matchInput.score2 = value;
  }

  onChangeWinner(value: MatchResult) {
    this.matchInput.result = value;
  }
}
