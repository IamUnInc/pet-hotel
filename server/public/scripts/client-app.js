$(document).ready(function () {
  getOwners();
  getPets();

  // $('#owner-submit').on('click', ownerPost);
  // $('#pet-submit').on('click', petPost);
});

function getOwners() {
  $.ajax({
    type: 'GET',
    url: '/owners',
    success: function (owners) {
      console.log('GET /owners returns:', owners);
      appendOwners(owners);
    },

    error: function (response) {
      console.log('GET /owners fail');
    },
  });
}

function getPets() {
  $.ajax({
      type: 'GET',
      url: '/pets',
      success: function (pets) {
        console.log('GET /pets returns:', pets);
        appendPets(pets);
      },

      error: function (response) {
        console.log('GET /pets fail. No pets could be retrieved!');
      },
    });
}

function appendPets(pets) {
  pets.forEach(function (pet) {
    var $el = $('<tr></tr>');
    pet.whole_name = pet.first_name + ' ' + pet.last_name;
    var petProperties = ['whole_name', 'pet_name', 'pet_breed', 'pet_color'];
    petProperties.forEach(function (property) {
      console.log("property: ", property)
      var $input = $('<td id="' + property + '"name="' + property + '" >' + pet[property] + '</td>');
      $input.val(pet[property]);
      $el.append($input);
    });

    $el.data('petId', pet.id);
    $el.append('<td><button class="update">Update</button></td>');
    $el.append('<td><button class="delete">Delete</button></td>');

    $('#pet-table').children().last().append($el);
  });
}

function appendOwners(owners) {

  owners.forEach(function (owner) {
    var $firstName = owner.first_name;
    var $lastName = owner.last_name;
    var $wholeName = $firstName + ' ' + $lastName;
    var $ownerId = owner.id;
    var $input = $('<option value = "' + $ownerId + '">' + $ownerId + ' - ' + $wholeName + '</option>');
    $('#owner-place').append($input);
  //console.log($input);
});
}
//
// // function ownerPost() {
//   event.preventDefault();
//
//   var owner = {};
//
// }
