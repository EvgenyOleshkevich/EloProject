import { Routes } from '@angular/router';
import { Games } from './pages/games/games';
import { Players } from './pages/players/players';
import { NotFound } from './pages/not-found/not-found';
import { Matches } from './pages/matches/matches';
import { Tournaments } from './pages/tournaments/tournaments';
import { TournamentPlannedComponent } from './pages/tournament/planned/tournament';
import { TournamentActiveComponent } from './pages/tournament/active/active';
import { TournamentFinishedComponent } from './pages/tournament/finished/finished';
import { PlayerComponent } from './pages/player/player';
import { Login } from './pages/login/login';
import { Users } from './pages/users/users';
import { authGuard } from './utils/functions';
import { UserRole } from './model/Enums';

export const routes: Routes = [
    {path: 'login', component: Login},
    {path: 'users',
        component: Users,
        canActivate: [authGuard],
        data: { roles: ['ADMIN'] }
    },
    {path: 'games', component: Games},
    {path: 'players', component: Players},
    {path: 'player', component: PlayerComponent},
    {path: ':gameName/players', component: Players},
    {path: 'tournaments', component: Tournaments},
    {path: ':gameName/tournaments', component: Tournaments},
    {path: 'matches', component: Matches},
    {path: ':gameName/matches', component: Matches},
    {path: 'players/:id', component: Players}, // <a [routerLink]="['/player', plaier.id ]">Link</a>
    {path: 'tournament', component: TournamentPlannedComponent},
    {path: 'ongoingTournament', component: TournamentActiveComponent},
    {path: 'finishedTournament', component: TournamentFinishedComponent},
    {path: '**', component: NotFound},

];

