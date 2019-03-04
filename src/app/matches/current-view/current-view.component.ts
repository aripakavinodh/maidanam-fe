import { Component, OnInit } from '@angular/core';
import { MatchesService } from '../../z-services/matches.service';
import { MatchModel } from '../../z-models/match.model';

@Component({
  selector: 'app-current-view',
  templateUrl: './current-view.component.html',
  styleUrls: ['./current-view.component.css']
})
export class CurrentViewComponent implements OnInit {

  constructor(private matchesService: MatchesService) { }

  currentMatches: MatchModel[];
  allMatches: MatchModel[];

  ngOnInit() {
    this.allMatches = this.matchesService.getMatches(111111);
    this.currentMatches = this.allMatches.filter(match => match.matchStatus === 'S').slice(0, 2);
    console.log(this.allMatches);
    console.log(this.currentMatches);
  }

}
