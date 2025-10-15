- [x] Bill is Drafted: Members of Congress, the Executive Branch, and even outside groups can draft (write or draw up) bills.
- [x] Introduced in House: Representative introduces the bill in the House. Only members can introduce bills.
- [x] Sent to Committee: The Speaker of the House sends the bill to a committee.
- [x] Committee Action: Most bills die here. The committee may pigeonhole, table, amend, or vote on the bill. If a bill passes, it goes to the Rules Committee.
- [x] Rules Committee: It decides the rules for debate, and when the bill will come up for debate.
- [ ] Floor Action: House debates the bill, and may add amendments. If a majority votes in favor of the bill, it goes to the Senate.
- [ ] Introduced in Senate: A Senator introduces the bill, which is sent to a committee.
- [ ] Committee Action: Same procedure as in the House. If the committee majority votes for the bill, it goes to the whole Senate.
- [ ] Bill Called Up: Majority floor leader decides when the whole Senate will consider the bill.
- [ ] Floor Action: The Bill is debated, and amendments may be added. If a majority votes in favor of the bill, it is returned to the House.
- [ ] Conference Committee: If the House rejects any of the changes, the bill goes to a conference committee of members from both houses. It works out a compromise.
- [ ] Vote on Compromise: Both houses must approve changes made by the conference committee. If approved, the bill goes to the president.
- [ ] Presidential Action: The president may sign (approve) the bill or veto (reject) it. If approved, it becomes law.
- [ ] Vote to Override: If the president vetoes the bill, it can still become law if two thirds of both houses vote to override the veto.
- [ ] Judicial Review *** When/if challenged - The Supreme Court will examine the law for constitutionality. 

**no point of bet in weighted random func, add in cases in if or swicth statement for diffferent probabilities of the outcomes**



1. Drafting: 10% chance it doesn't get a sponsor -> you fail
2. Introduce 1: 10% chance nobody cares and you fail immediately
    Reaction from this round e.g. [0.9, 0.1] -> 90% positive, 10% negative helps next round
3. Committee Send: Mike Johnson sends it to a committee of your choice
4. Committee Stuff: 0.3 amend, 0.3 pigeonhole, 0.2 table, 0.15 vote, 0.05 unanimous pass to rules
            if reaction > 90% positive -> automatic vote (1st roll nmw)
            committee reaction [pos, neg]
5. Rules comm: Hours [4, 2, 1, 2/3] Prob (respective) [0.2, 0.25, 0.3, 0.25]
               If committee neg reaction > 0.8 -> probs are now [0.05, 0.1, 0.2, 0.65]
6. Floor Action: 
    Germane Amend - 0.5
    Nongermane Amends - 0.3
    Vote - 0.2
    Do until vote
    If vote [pos, neg] -> neg > 0.50 -> fail
                            -> pass
7. Introduce to Senate: 
    Introduce -> Get senator -> Prob [0.9, 0.1] [Get, not get (fail)] but if house reacction for pos is < 0.60 -> Prob [0.5, 0.5] [get, not get (fail)] 
    if no senator to sponsor -> bill fails


8. Senate COmmittee thingy for the thingy: 
    Sent to committee of your choice ->
    Intro react like house

9. bill called up 
same as house rules committee
[0.5, 0.5] with bad init reaction, [0.6, 0.4] with good init reaction

10. floor action thing ill do it later