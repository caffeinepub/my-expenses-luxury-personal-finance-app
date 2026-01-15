import Array "mo:core/Array";
import Map "mo:core/Map";
import Order "mo:core/Order";
import Text "mo:core/Text";
import Int "mo:core/Int";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  type Date = Time.Time;

  public type Expense = {
    id : Nat;
    item : Text;
    amount : Float;
    date : Date;
    paidBy : Text; // "Me" or friendId as Text
    friendId : ?Nat;
    isSettled : Bool;
  };

  public type Friend = {
    id : Nat;
    name : Text;
    totalBorrowed : Float;
    totalLent : Float;
  };

  public type Settlement = {
    id : Nat;
    friendId : Nat;
    amount : Float;
    date : Date;
    direction : Text; // "PaidByMe" or "PaidToMe"
  };

  public type Summary = {
    personalExpenses : Float;
    totalExpenses : Float;
    totalBorrowed : Float;
    totalLent : Float;
    friendsSummary : [(Nat, Float)];
  };

  public type UserProfile = {
    name : Text;
  };

  type UserData = {
    var nextFriendId : Nat;
    var nextExpenseId : Nat;
    var nextSettlementId : Nat;
    expenses : Map.Map<Nat, Expense>;
    friends : Map.Map<Nat, Friend>;
    settlements : Map.Map<Nat, Settlement>;
  };

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  let userProfiles = Map.empty<Principal, UserProfile>();
  let userData = Map.empty<Principal, UserData>();

  func getUserData(caller : Principal) : UserData {
    switch (userData.get(caller)) {
      case (?data) { data };
      case (null) {
        let newData : UserData = {
          var nextFriendId = 0;
          var nextExpenseId = 0;
          var nextSettlementId = 0;
          expenses = Map.empty<Nat, Expense>();
          friends = Map.empty<Nat, Friend>();
          settlements = Map.empty<Nat, Settlement>();
        };
        userData.add(caller, newData);
        newData;
      };
    };
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public shared ({ caller }) func addExpense(item : Text, amount : Float, date : Date, paidBy : Text, friendId : ?Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add expenses");
    };

    let data = getUserData(caller);

    let expense : Expense = {
      id = data.nextExpenseId;
      item;
      amount;
      date;
      paidBy;
      friendId;
      isSettled = false;
    };

    if (paidBy != "Me") {
      switch (friendId) {
        case (?fId) {
          switch (data.friends.get(fId)) {
            case (null) { Runtime.trap("Friend not found") };
            case (?friend) {
              let updatedFriend = {
                friend with
                totalBorrowed = friend.totalBorrowed + amount;
              };
              data.friends.add(friend.id, updatedFriend);
            };
          };
        };
        case (null) { Runtime.trap("Friend ID required when friend paid") };
      };
    };

    data.expenses.add(data.nextExpenseId, expense);
    data.nextExpenseId += 1;
  };

  public shared ({ caller }) func updateExpense(id : Nat, item : Text, amount : Float, date : Date, paidBy : Text, friendId : ?Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update expenses");
    };

    let data = getUserData(caller);

    switch (data.expenses.get(id)) {
      case (null) { Runtime.trap("Expense not found") };
      case (?oldExpense) {
        // Revert old expense effects
        if (oldExpense.paidBy != "Me") {
          switch (oldExpense.friendId) {
            case (?fId) {
              switch (data.friends.get(fId)) {
                case (?friend) {
                  let updatedFriend = {
                    friend with
                    totalBorrowed = friend.totalBorrowed - oldExpense.amount;
                  };
                  data.friends.add(friend.id, updatedFriend);
                };
                case (null) {};
              };
            };
            case (null) {};
          };
        };

        // Apply new expense effects
        if (paidBy != "Me") {
          switch (friendId) {
            case (?fId) {
              switch (data.friends.get(fId)) {
                case (null) { Runtime.trap("Friend not found") };
                case (?friend) {
                  let updatedFriend = {
                    friend with
                    totalBorrowed = friend.totalBorrowed + amount;
                  };
                  data.friends.add(friend.id, updatedFriend);
                };
              };
            };
            case (null) { Runtime.trap("Friend ID required when friend paid") };
          };
        };

        let updatedExpense : Expense = {
          id;
          item;
          amount;
          date;
          paidBy;
          friendId;
          isSettled = oldExpense.isSettled;
        };
        data.expenses.add(id, updatedExpense);
      };
    };
  };

  public shared ({ caller }) func deleteExpense(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete expenses");
    };

    let data = getUserData(caller);

    switch (data.expenses.get(id)) {
      case (null) { Runtime.trap("Expense not found") };
      case (?expense) {
        // Revert expense effects
        if (expense.paidBy != "Me") {
          switch (expense.friendId) {
            case (?fId) {
              switch (data.friends.get(fId)) {
                case (?friend) {
                  let updatedFriend = {
                    friend with
                    totalBorrowed = friend.totalBorrowed - expense.amount;
                  };
                  data.friends.add(friend.id, updatedFriend);
                };
                case (null) {};
              };
            };
            case (null) {};
          };
        };

        data.expenses.remove(id);
      };
    };
  };

  public shared ({ caller }) func addFriend(name : Text) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add friends");
    };

    let data = getUserData(caller);

    let friend : Friend = {
      id = data.nextFriendId;
      name;
      totalBorrowed = 0.0;
      totalLent = 0.0;
    };

    data.friends.add(data.nextFriendId, friend);
    data.nextFriendId += 1;
    friend.id;
  };

  public shared ({ caller }) func updateFriend(id : Nat, name : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update friends");
    };

    let data = getUserData(caller);

    switch (data.friends.get(id)) {
      case (null) { Runtime.trap("Friend not found") };
      case (?friend) {
        let updatedFriend = {
          friend with
          name;
        };
        data.friends.add(id, updatedFriend);
      };
    };
  };

  public shared ({ caller }) func deleteFriend(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete friends");
    };

    let data = getUserData(caller);
    data.friends.remove(id);
  };

  public shared ({ caller }) func addSettlement(friendId : Nat, amount : Float, date : Date, direction : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add settlements");
    };

    let data = getUserData(caller);

    let settlement : Settlement = {
      id = data.nextSettlementId;
      friendId;
      amount;
      date;
      direction;
    };

    data.settlements.add(data.nextSettlementId, settlement);

    switch (data.friends.get(friendId)) {
      case (null) { Runtime.trap("Friend not found") };
      case (?friend) {
        let updatedFriend = {
          friend with
          totalBorrowed = if (direction == "PaidToMe") {
            friend.totalBorrowed - amount;
          } else {
            friend.totalBorrowed;
          };
        };
        data.friends.add(friendId, updatedFriend);
      };
    };

    data.nextSettlementId += 1;
  };

  public shared ({ caller }) func updateSettlement(id : Nat, friendId : Nat, amount : Float, date : Date, direction : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update settlements");
    };

    let data = getUserData(caller);

    switch (data.settlements.get(id)) {
      case (null) { Runtime.trap("Settlement not found") };
      case (?oldSettlement) {
        // Revert old settlement effects
        switch (data.friends.get(oldSettlement.friendId)) {
          case (?friend) {
            let revertedFriend = {
              friend with
              totalBorrowed = if (oldSettlement.direction == "PaidToMe") {
                friend.totalBorrowed + oldSettlement.amount;
              } else {
                friend.totalBorrowed;
              };
            };
            data.friends.add(oldSettlement.friendId, revertedFriend);
          };
          case (null) {};
        };

        // Apply new settlement effects
        switch (data.friends.get(friendId)) {
          case (null) { Runtime.trap("Friend not found") };
          case (?friend) {
            let updatedFriend = {
              friend with
              totalBorrowed = if (direction == "PaidToMe") {
                friend.totalBorrowed - amount;
              } else {
                friend.totalBorrowed;
              };
            };
            data.friends.add(friendId, updatedFriend);
          };
        };

        let updatedSettlement : Settlement = {
          id;
          friendId;
          amount;
          date;
          direction;
        };
        data.settlements.add(id, updatedSettlement);
      };
    };
  };

  public shared ({ caller }) func deleteSettlement(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete settlements");
    };

    let data = getUserData(caller);

    switch (data.settlements.get(id)) {
      case (null) { Runtime.trap("Settlement not found") };
      case (?settlement) {
        // Revert settlement effects
        switch (data.friends.get(settlement.friendId)) {
          case (?friend) {
            let updatedFriend = {
              friend with
              totalBorrowed = if (settlement.direction == "PaidToMe") {
                friend.totalBorrowed + settlement.amount;
              } else {
                friend.totalBorrowed;
              };
            };
            data.friends.add(settlement.friendId, updatedFriend);
          };
          case (null) {};
        };

        data.settlements.remove(id);
      };
    };
  };

  module Expense {
    public func compareByDateDescending(exp1 : Expense, exp2 : Expense) : Order.Order {
      Int.compare(exp2.date, exp1.date); // Expensive is sorted by decreasing date
    };
  };

  public query ({ caller }) func getExpenses() : async [Expense] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view expenses");
    };

    let data = getUserData(caller);
    let expensesArray = data.expenses.values().toArray();
    expensesArray.sort(Expense.compareByDateDescending);
  };

  public query ({ caller }) func getFriends() : async [Friend] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view friends");
    };

    let data = getUserData(caller);
    data.friends.values().toArray();
  };

  public query ({ caller }) func getSettlements() : async [Settlement] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view settlements");
    };

    let data = getUserData(caller);
    data.settlements.values().toArray();
  };

  public query ({ caller }) func getSummary() : async Summary {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view summary");
    };

    let data = getUserData(caller);

    var personalExpenses : Float = 0.0;
    var totalExpenses : Float = 0.0;
    var totalBorrowed : Float = 0.0;
    var totalLent : Float = 0.0;

    for (expense in data.expenses.values()) {
      personalExpenses += expense.amount;
      if (expense.paidBy == "Me") {
        totalExpenses += expense.amount;
      };
    };

    for (friend in data.friends.values()) {
      totalBorrowed += friend.totalBorrowed;
      totalLent += friend.totalLent;
    };

    for (settlement in data.settlements.values()) {
      if (settlement.direction == "PaidToMe") {
        totalExpenses -= settlement.amount;
      };
    };

    let friendsSummaryArray = data.friends.values().toArray().map(
      func(friend) { (friend.id, friend.totalBorrowed - friend.totalLent) }
    );

    {
      personalExpenses;
      totalExpenses;
      totalBorrowed;
      totalLent;
      friendsSummary = friendsSummaryArray;
    };
  };
};
