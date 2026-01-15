import Map "mo:core/Map";

module {
  type OldActor = {
    userProfiles : Map.Map<Principal, { name : Text }>;
    userData : Map.Map<Principal, {
      var nextFriendId : Nat;
      var nextExpenseId : Nat;
      var nextSettlementId : Nat;
      expenses : Map.Map<Nat, {
        id : Nat;
        item : Text;
        amount : Float;
        date : Int;
        paidBy : Text;
        friendId : ?Nat;
        isSettled : Bool;
      }>;
      friends : Map.Map<Nat, {
        id : Nat;
        name : Text;
        totalLent : Float;
        totalBorrowed : Float;
      }>;
      settlements : Map.Map<Nat, {
        id : Nat;
        friendId : Nat;
        amount : Float;
        date : Int;
        direction : Text;
      }>;
    }>;
  };

  type NewActor = {
    userProfiles : Map.Map<Principal, { name : Text }>;
    userData : Map.Map<Principal, {
      var nextFriendId : Nat;
      var nextExpenseId : Nat;
      var nextSettlementId : Nat;
      expenses : Map.Map<Nat, {
        id : Nat;
        item : Text;
        amount : Float;
        date : Int;
        paidBy : Text;
        friendId : ?Nat;
        isSettled : Bool;
      }>;
      friends : Map.Map<Nat, {
        id : Nat;
        name : Text;
        totalLent : Float;
        totalBorrowed : Float;
      }>;
      settlements : Map.Map<Nat, {
        id : Nat;
        friendId : Nat;
        amount : Float;
        date : Int;
        direction : Text;
      }>;
    }>;
  };

  public func run(old : OldActor) : NewActor {
    let newUserData = old.userData.map<Principal, {
      var nextFriendId : Nat;
      var nextExpenseId : Nat;
      var nextSettlementId : Nat;
      expenses : Map.Map<Nat, {
        id : Nat;
        item : Text;
        amount : Float;
        date : Int;
        paidBy : Text;
        friendId : ?Nat;
        isSettled : Bool;
      }>;
      friends : Map.Map<Nat, {
        id : Nat;
        name : Text;
        totalLent : Float;
        totalBorrowed : Float;
      }>;
      settlements : Map.Map<Nat, {
        id : Nat;
        friendId : Nat;
        amount : Float;
        date : Int;
        direction : Text;
      }>;
    }, {
      var nextFriendId : Nat;
      var nextExpenseId : Nat;
      var nextSettlementId : Nat;
      expenses : Map.Map<Nat, {
        id : Nat;
        item : Text;
        amount : Float;
        date : Int;
        paidBy : Text;
        friendId : ?Nat;
        isSettled : Bool;
      }>;
      friends : Map.Map<Nat, {
        id : Nat;
        name : Text;
        totalLent : Float;
        totalBorrowed : Float;
      }>;
      settlements : Map.Map<Nat, {
        id : Nat;
        friendId : Nat;
        amount : Float;
        date : Int;
        direction : Text;
      }>;
    }>(
      func(_principal, userData) {
        let newFriends = userData.friends.map<Nat, {
          id : Nat;
          name : Text;
          totalLent : Float;
          totalBorrowed : Float;
        }, {
          id : Nat;
          name : Text;
          totalLent : Float;
          totalBorrowed : Float;
        }>(
          func(_id, friend) {
            {
              id = friend.id;
              name = friend.name;
              totalLent = friend.totalBorrowed;
              totalBorrowed = friend.totalLent;
            };
          }
        );
        {
          var nextFriendId = userData.nextFriendId;
          var nextExpenseId = userData.nextExpenseId;
          var nextSettlementId = userData.nextSettlementId;
          expenses = userData.expenses;
          friends = newFriends;
          settlements = userData.settlements;
        };
      }
    );
    {
      userProfiles = old.userProfiles;
      userData = newUserData;
    };
  };
};
