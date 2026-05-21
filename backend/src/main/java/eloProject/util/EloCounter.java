package eloProject.util;

import eloProject.model.Player;
import eloProject.util.enums.MatchResult;

public class EloCounter {

    public static void count(Player playerA, Player playerB, MatchResult res) { // 1: A - won, 3: draw, 3: B - won
        int Ra = playerA.getElo(), Rb = playerB.getElo();

        double Ea = 1/(1 + Math.pow(10, (double) (Rb - Ra) / 400));
        double Eb = 1/(1 + Math.pow(10, (double) (Ra - Rb) / 400));
        int Ka = GetK(Ra, playerA.getNumberMatches());
        int Kb = GetK(Rb, playerB.getNumberMatches());
        double Sa = GetS(res), Sb = 1 - GetS(res);
        playerA.setElo(Ra + (int) (Ka * (Sa - Ea)));
        playerB.setElo(Rb + (int) (Kb * (Sb - Eb)));
        playerA.incMatches();
        playerB.incMatches();
    }

    private static int GetK(int rating, int numberMatches) {
        return rating > 2400 ?
                10 :
                numberMatches > 30 ?
                    20 :
                    40;
    }

    private static double GetS(MatchResult res) {
        return res == MatchResult.PLAYER_1_WIN ?
                1 :
                res == MatchResult.DRAW ?
                0.5 :
                0;
    }

    public static boolean isPowerOfTwo(int n) {
        return (n != 0) && ((n & (n - 1)) == 0);
    }

    public static int getPowerOfTwo(int n) {
        int power = 0;
        while (n != 1) {
            n >>= 1;
            ++power;
        }
        return power;
    }
}