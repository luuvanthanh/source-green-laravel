@extends('layouts.master')

@section('title')
Support Dashboard
@endsection

@section('content')
<div class="container">
    <div class="row">
        <div class="col">
            <h2>Support Tickets</h2>

            <p class="lead">
                This is the list of most recent support tickets. Click the "Call customer" button to start a phone call from your browser.
            </p>
        </div>
    </div>


    <div class="row">

        <div class="col-md-5 order-md-2 mb-4">
            <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#call">
                Launch demo modal
            </button>
            <div class="modal fade" id="call" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLabel">Modal title</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>

                        <div class="modal-body">
                            <div class="card">
                                <h5 class="card-header">
                                    Make a call
                                </h5>
                                <div class="card-body">
                                    <div class="form-group row">
                                        <label for="call-status" class="col-3 col-form-label">Status</label>
                                        <div class="col-9">
                                            <input id="call-status" class="form-control" type="text" placeholder="Connecting to Twilio..." readonly>
                                        </div>
                                    </div>
                                    <div class="row content-call d-none">
                                        <label for="" class="col-md-12">Nội dung</label>
                                        <textarea class="col-md-12" name="" id="content-call" cols="30" rows="5"></textarea>
                                    </div>
                                    <div class="row col-ms-12">
                                        <button class="btn btn-lg btn-primary answer-button col-sm-4 " disabled>Answer call</button>
                                        <button type="button" class="btn btn-primary" id="forward"  data-toggle="modal" data-target=".bd-example-modal-md" onclick="forward()">Chuyển tiếp</button>
                                        <button class="btn btn-lg btn-danger hangup-button col-sm-4 " disabled onclick="hangUp()">Hang up</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-primary">Save changes</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- popup forward -->
        <div class="modal fade bd-example-modal-md" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-md">
                <div class="modal-content">
                    <div class="modal-body">
                        <div class="card">
                            <h5 class="card-header">
                                Danh sách sale
                            </h5>
                            <div class="card-body">
                                <div class="row col-ms-12">
                                    <table class="table table-striped">
                                        <thead>
                                            <tr>
                                                <th scope="col">Tên</th>
                                                <th scope="col">Trạng thái</th>
                                                <th scope="col">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody id="body-table-employee">
                                            <tr>
                                                <th scope="row">Mai Văn Anh</th>
                                                <td>Kimochi</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-md-7 order-mde-1">
            @foreach ($tickets as $ticket)
            <div class="card border-default">
                <h5 class="card-header">
                    Ticket #{{ $ticket->id }}
                    <small class="float-right">{{ $ticket->created_at}}</small>
                </h5>

                <div class="card-body">
                    <div class="row">
                        <div class="col">
                            <p><strong>Name:</strong> {{ $ticket->name }}</p>
                            <p><strong>Phone number:</strong> {{ $ticket->phone_number }}</p>
                            <p><strong>Description:</strong></p>
                            {{ $ticket->description }}
                        </div>

                        <div class="col col-auto">
                            <button onclick="callCustomer('{{ $ticket->phone_number }}')" type="button" class="btn btn-primary btn-lg call-customer-button">
                                Call customer
                            </button>
                        </div>
                    </div>
                </div>

            </div>
            @endforeach
        </div>

    </div>
</div>
@endsection('content')