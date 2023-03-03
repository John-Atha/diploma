import torch
import torch_geometric
from py2neo import Graph


def sync_users(model, database_url, database_username, database_password):
    # get the number of users in the database
    graph = Graph(
        database_url,
        auth=(database_username, database_password),
    )
    num_users = graph.run("MATCH (u:User) RETURN count(u) as num_users").data()[0]["num_users"]
    print(f"Number of users in the database: {num_users}")
    convs = [conv for conv in model.encoder.convs.children()]
    conv = convs[0]
    dimension_to_ignore = nested_children(model.encoder)["convs"]["0"]["user__rates__movie"]["lin_r"].weight.shape[1]

    for gnn_layer in conv.children():
        for layer in gnn_layer.children():
            if isinstance(layer, torch_geometric.nn.dense.Linear):
                print(layer, end=": ")
                
                weight_matrix_users = layer.weight.shape[1]
                if (weight_matrix_users == dimension_to_ignore):
                    print("not a layer that throws the errors")
                    continue

                if (weight_matrix_users == num_users):
                    print(f"{num_users} users up to date")
                else:
                    new_cols_num = num_users - weight_matrix_users
                    if new_cols_num > 0:
                        # add new columns with random values to the weight matrix
                        # each element of the new columns is the mean of the corresponding row
                        new_cols = torch.zeros(
                            layer.weight.shape[0], new_cols_num)
                        for i in range(layer.weight.shape[0]):
                            new_cols[i] = torch.mean(layer.weight[i])
                        
                        layer.weight = torch.nn.Parameter(
                            torch.cat((layer.weight, new_cols), dim=1))
                        print(f"should add {new_cols_num} users")
                    else:
                        print(f"should remove {-new_cols_num} users")

def nested_children(m: torch.nn.Module):
    children = dict(m.named_children())
    output = {}
    if children == {}:
        # if module has no children; m is last child! :O
        return m
    else:
        # look for children from children... to the last child!
        for name, child in children.items():
            try:
                output[name] = nested_children(child)
            except TypeError:
                output[name] = nested_children(child)
    return output