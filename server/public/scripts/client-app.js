$(document).ready(function () {
  getOwners();
  getPets();

  $('#owner-submit').on('click', ownerPost);
  $('#pet-submit').on('click', petPost);
  $('#pet-table').on('click', '.delete', deletePet);
  $('#pet-table').on('click', '.update', putPet);
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
    var $el = $('<tr class="petRow"></tr>');
    pet.whole_name = pet.first_name + ' ' + pet.last_name;
    $el.append('<td>' + pet.whole_name + '</td>');
    var petProperties = ['pet_name', 'pet_breed', 'pet_color'];
    petProperties.forEach(function (property) {
      console.log("property: ", property)
      var $input = $('<td><input type = "text" id="' + property + '" name="' + property + '" value="' + pet[property] + '" /></td>');
      $el.append($input);
    });
    console.log(pet);
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

function ownerPost() {
  event.preventDefault();

  var owner = {};

  $.each($('#owner-form').serializeArray(), function (i, field) {
    owner[field.name] = field.value;
  });

  $.ajax({
      type: 'POST',
      url: '/owners',
      data: owner,
      success: function () {
        console.log('POST /owners works!');
        $('#owner-place').empty();
        getOwners();
      },

      error: function (response) {
        console.log('POST /owners does not work...');
      },
    });
}

function petPost() {
  event.preventDefault();

  var pet = {};

  $.each($('#pet-form').serializeArray(), function (i, field) {
    pet[field.name] = field.value;
  });

  $.ajax({
      type: 'POST',
      url: '/pets',
      data: pet,
      success: function () {
        console.log('POST /pets works!');
        $('.table-header').siblings().empty();
        getPets();
      },

      error: function (response) {
        console.log('POST /pets does not work...');
      },
    });

}

function deletePet () {
  //console.log("this:", $(this).parent());
  var petId = $(this).parent().parent().data('petId');

  $.ajax({
    type: 'DELETE',
    url: '/pets/' + petId,
    success: function () {
      console.log('DELETE success');
      $('.table-header').siblings().empty();
      getPets();
    },
    error: function () {
      console.log('DELETE failed');
    }
  });
}

function putPet() {
  var pet = {};
  console.log("this:", $(this).parent().parent(".petRow"));
  var inputs = $(this).parent().parent(".petRow").children().children().serializeArray();
  console.log(inputs);
  $.each(inputs, function(i, field) {
    pet[field.name] = field.value;
  });

  console.log('pet we are putting', pet);

  var petId = $(this).parent().parent().data('petId');
  console.log(petId);

  $.ajax({
    type: 'PUT',
    url: '/pets/' + petId,
    data: pet,
    success: function () {
      $('.table-header').siblings().empty();
      getPets();
    },
    error: function() {
      console.log('Error PUT /pets/' + petId);
    },
  });
}
